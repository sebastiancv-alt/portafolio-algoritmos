#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera conocimiento.js: lo que el asistente del portafolio sabe de tus archivos.

Qué lee dentro de la carpeta "archivos":
  - ZIP con proyectos Java: clases, métodos (con su comentario) y cantidad de líneas.
  - PDF: el texto (necesita:  pip install pypdf).
  - DOCX: el texto.
  - Infografías (PNG/JPG): solo si usas --ocr (necesita Tesseract, pytesseract y Pillow).

Cómo usarlo (desde la carpeta donde está index.html):
    python generar_conocimiento.py
    python generar_conocimiento.py --ocr      (opcional, es lento)

Después sube conocimiento.js junto con tus demás archivos.
Vuelve a ejecutarlo cada vez que agregues semanas o cambies un ZIP.
"""
import argparse
import datetime
import json
import re
import sys
import zipfile
from pathlib import Path

CARPETA = "archivos"
MAX_TEXTO = 12000          # caracteres de texto por documento
PALABRAS_NO_METODO = {
    "if", "for", "while", "switch", "catch", "else", "return", "new", "try",
    "synchronized", "do", "throw", "assert", "super", "this",
}
MODIFICADORES = {"public", "private", "protected", "static", "final", "abstract", "synchronized"}

RE_CLASE = re.compile(
    r"^[ \t]*(?:(?:public|private|protected|abstract|final|static)\s+)*(class|interface|enum|record)\s+(\w+)",
    re.MULTILINE,
)
RE_METODO = re.compile(
    r"^[ \t]*((?:(?:public|private|protected|static|final|abstract|synchronized)\s+)*)"
    r"(?:<[^>\n]+>\s+)?(?:([\w\[\]<>,.?]+(?:<[^>\n]*>)?(?:\[\])*)\s+)?(\w+)\s*\(([^)]*)\)\s*(?:throws\s+[\w,.\s]+)?\{",
    re.MULTILINE,
)


def leer_texto(datos: bytes) -> str:
    for cod in ("utf-8", "cp1252", "latin-1"):
        try:
            return datos.decode(cod)
        except UnicodeDecodeError:
            continue
    return datos.decode("utf-8", errors="ignore")


def comentario_previo(texto: str, pos: int) -> str:
    """Devuelve el comentario (javadoc o //) que está justo antes de la posición."""
    antes = texto[:pos].rstrip()
    if antes.endswith("*/"):
        ini = antes.rfind("/*")
        if ini != -1:
            bloque = antes[ini:]
            lineas = [re.sub(r"\s*\*+/\s*$", "", re.sub(r"^\s*(/\*+|\*+/?|\*)\s?", "", l)).strip() for l in bloque.splitlines()]
            lineas = [l for l in lineas if l and not l.startswith("@")]
            return " ".join(lineas)[:240]
    ultimas = antes.splitlines()[-3:]
    com = []
    for l in reversed(ultimas):
        s = l.strip()
        if s.startswith("//"):
            com.insert(0, s.lstrip("/").strip())
        else:
            break
    return " ".join(com)[:240]


def analizar_java(texto: str):
    clases = [(m.start(), m.group(1), m.group(2)) for m in RE_CLASE.finditer(texto)]
    resultado = {}
    for pos, tipo, nombre in clases:
        resultado.setdefault(nombre, {"nombre": nombre, "tipo": tipo, "comentario": comentario_previo(texto, pos), "metodos": []})
    for m in RE_METODO.finditer(texto):
        mods, tipo_ret, nombre, params = m.group(1), (m.group(2) or "").strip(), m.group(3), m.group(4)
        if nombre in PALABRAS_NO_METODO or tipo_ret in PALABRAS_NO_METODO:
            continue
        # clase a la que pertenece: la última declarada antes de este método
        duena = None
        for pos, _t, cn in clases:
            if pos < m.start():
                duena = cn
        if duena is None:
            continue
        if tipo_ret in MODIFICADORES:
            tipo_ret = ""
        es_constructor = nombre == duena and not tipo_ret
        if not tipo_ret and not es_constructor:
            continue
        params = re.sub(r"\s+", " ", params.strip())
        firma = f"{nombre}({params})"
        resultado[duena]["metodos"].append({
            "nombre": nombre,
            "firma": firma,
            "retorno": tipo_ret or "",
            "constructor": es_constructor,
            "comentario": comentario_previo(texto, m.start()),
        })
    return list(resultado.values())


def semana_de(ruta: Path):
    m = re.search(r"semana\s*[_-]?\s*(\d+)", str(ruta).replace("\\", "/"), re.IGNORECASE)
    return int(m.group(1)) if m else None


def leer_zip(ruta: Path):
    clases, lineas, n_java = [], 0, 0
    try:
        with zipfile.ZipFile(ruta) as z:
            for info in z.infolist():
                if not info.filename.lower().endswith(".java"):
                    continue
                n_java += 1
                texto = leer_texto(z.read(info))
                lineas += texto.count("\n") + 1
                clases.extend(analizar_java(texto))
    except zipfile.BadZipFile:
        print(f"  ! No se pudo abrir {ruta} (¿es un RAR renombrado?). Se omite.")
        return None
    return {
        "nombre": ruta.stem,
        "ruta": ruta.as_posix(),
        "semana": semana_de(ruta),
        "archivosJava": n_java,
        "lineas": lineas,
        "clases": clases,
    }


def leer_pdf(ruta: Path):
    try:
        from pypdf import PdfReader
    except ImportError:
        try:
            from PyPDF2 import PdfReader  # type: ignore
        except ImportError:
            return None
    try:
        lector = PdfReader(str(ruta))
        texto = " ".join((p.extract_text() or "") for p in lector.pages)
    except Exception as e:  # noqa: BLE001
        print(f"  ! No se pudo leer {ruta}: {e}")
        return ""
    return re.sub(r"\s+", " ", texto).strip()


def leer_docx(ruta: Path):
    try:
        with zipfile.ZipFile(ruta) as z:
            xml = leer_texto(z.read("word/document.xml"))
    except (KeyError, zipfile.BadZipFile):
        return ""
    xml = re.sub(r"</w:p>", "\n", xml)
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", xml)).strip()


def leer_imagen_ocr(ruta: Path):
    try:
        from PIL import Image
        import pytesseract
    except ImportError:
        print("  ! Para --ocr instala: pip install pytesseract pillow (y Tesseract con idioma español)")
        sys.exit(1)
    try:
        texto = pytesseract.image_to_string(Image.open(ruta), lang="spa")
    except Exception:  # noqa: BLE001
        texto = pytesseract.image_to_string(Image.open(ruta))
    return re.sub(r"\s+", " ", texto).strip()


def main():
    ap = argparse.ArgumentParser(description="Genera conocimiento.js para el asistente del portafolio.")
    ap.add_argument("--carpeta", default=CARPETA, help="carpeta con los archivos (por defecto: archivos)")
    ap.add_argument("--salida", default="conocimiento.js")
    ap.add_argument("--ocr", action="store_true", help="leer también el texto de las infografías (lento)")
    args = ap.parse_args()

    base = Path(args.carpeta)
    if not base.is_dir():
        print(f"No encuentro la carpeta '{base}'. Ejecuta el script desde la carpeta donde está index.html.")
        sys.exit(1)

    proyectos, documentos, sin_pypdf = [], [], False
    archivos = sorted(p for p in base.rglob("*") if p.is_file())
    print(f"Revisando {len(archivos)} archivos…")

    for ruta in archivos:
        ext = ruta.suffix.lower()
        rel = Path(ruta.as_posix())
        if ext == ".zip":
            info = leer_zip(rel)
            if info:
                proyectos.append(info)
                print(f"  ZIP  {rel}: {len(info['clases'])} clases")
        elif ext in (".pdf", ".docx") or (ext in (".png", ".jpg", ".jpeg") and args.ocr):
            if ext == ".pdf":
                texto = leer_pdf(rel)
                if texto is None:
                    sin_pypdf = True
                    continue
            elif ext == ".docx":
                texto = leer_docx(rel)
            else:
                texto = leer_imagen_ocr(rel)
            if texto:
                documentos.append({
                    "nombre": ruta.name,
                    "ruta": rel.as_posix(),
                    "semana": semana_de(rel),
                    "texto": texto[:MAX_TEXTO],
                })
                print(f"  TXT  {rel}: {len(texto)} caracteres")

    if sin_pypdf:
        print("  ! Hay PDF pero falta la librería. Instálala con:  pip install pypdf")

    salida = {
        "generado": datetime.date.today().isoformat(),
        "proyectos": proyectos,
        "documentos": documentos,
    }
    contenido = "/* Generado por generar_conocimiento.py. No lo edites a mano. */\n"
    contenido += "window.CONOCIMIENTO = " + json.dumps(salida, ensure_ascii=False, indent=1) + ";\n"
    Path(args.salida).write_text(contenido, encoding="utf-8")
    print(f"\nListo: {args.salida} ({len(proyectos)} proyectos, {len(documentos)} documentos con texto).")


if __name__ == "__main__":
    main()
