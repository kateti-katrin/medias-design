from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer

ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'smysl-defense-guide.md'
TARGET = ROOT / 'smysl-defense-guide.pdf'

ARIAL = '/System/Library/Fonts/Supplemental/Arial.ttf'
ARIAL_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
BOUNDED = str((ROOT.parent / 'app/assets/fonts/Bounded-Bold.otf').resolve())

pdfmetrics.registerFont(TTFont('ArialCustom', ARIAL))
pdfmetrics.registerFont(TTFont('ArialBoldCustom', ARIAL_BOLD))
# OTF can fail on some systems; keep PDF generation robust.
try:
    pdfmetrics.registerFont(TTFont('BoundedCustom', BOUNDED))
    title_font = 'BoundedCustom'
except Exception:
    title_font = 'ArialBoldCustom'

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(
    name='CoverTitle',
    parent=styles['Title'],
    fontName=title_font,
    fontSize=22,
    leading=26,
    textColor=colors.HexColor('#111111'),
    alignment=TA_CENTER,
    spaceAfter=8,
))
styles.add(ParagraphStyle(
    name='Lead',
    parent=styles['BodyText'],
    fontName='ArialCustom',
    fontSize=10.5,
    leading=15,
    textColor=colors.HexColor('#444444'),
    alignment=TA_CENTER,
    spaceAfter=10,
))
styles.add(ParagraphStyle(
    name='H1Custom',
    parent=styles['Heading1'],
    fontName='ArialBoldCustom',
    fontSize=16,
    leading=20,
    textColor=colors.HexColor('#111111'),
    spaceBefore=10,
    spaceAfter=8,
))
styles.add(ParagraphStyle(
    name='H2Custom',
    parent=styles['Heading2'],
    fontName='ArialBoldCustom',
    fontSize=12.5,
    leading=16,
    textColor=colors.HexColor('#111111'),
    spaceBefore=8,
    spaceAfter=4,
))
styles.add(ParagraphStyle(
    name='BodyCustom',
    parent=styles['BodyText'],
    fontName='ArialCustom',
    fontSize=10.5,
    leading=15,
    textColor=colors.HexColor('#222222'),
    spaceAfter=4,
))
styles.add(ParagraphStyle(
    name='BulletCustom',
    parent=styles['BodyText'],
    fontName='ArialCustom',
    fontSize=10.5,
    leading=15,
    leftIndent=14,
    firstLineIndent=-8,
    bulletIndent=0,
    textColor=colors.HexColor('#222222'),
    spaceAfter=2,
))
styles.add(ParagraphStyle(
    name='NumberCustom',
    parent=styles['BodyText'],
    fontName='ArialCustom',
    fontSize=10.5,
    leading=15,
    leftIndent=16,
    firstLineIndent=-12,
    textColor=colors.HexColor('#222222'),
    spaceAfter=2,
))
styles.add(ParagraphStyle(
    name='QuoteCustom',
    parent=styles['BodyText'],
    fontName='ArialCustom',
    fontSize=10.2,
    leading=15,
    leftIndent=14,
    borderPadding=(6, 0, 0),
    borderColor=colors.HexColor('#d8d8d8'),
    borderWidth=0.6,
    borderLeft=True,
    textColor=colors.HexColor('#333333'),
    spaceAfter=6,
))


def page_number(canvas, doc):
    canvas.saveState()
    canvas.setFont('ArialCustom', 9)
    canvas.setFillColor(colors.HexColor('#666666'))
    canvas.drawRightString(doc.pagesize[0] - 18 * mm, 10 * mm, f'{canvas.getPageNumber()}')
    canvas.restoreState()


def inline_markup(text: str) -> str:
    text = escape(text)
    text = text.replace('->', '&rarr;')
    return text


def build_story(md_text: str):
    story = []
    story.append(Spacer(1, 10))
    story.append(Paragraph('СМЫСЛ — шпаргалка к защите проекта', styles['CoverTitle']))
    story.append(Paragraph('Коротко, понятно и по-человечески: что показать, что сказать и как объяснить backend без сложных слов.', styles['Lead']))
    story.append(Spacer(1, 8))

    for raw_line in md_text.splitlines():
        line = raw_line.rstrip()
        stripped = line.strip()

        if not stripped:
            story.append(Spacer(1, 4))
            continue

        if stripped.startswith('# '):
            continue
        if stripped.startswith('## '):
            story.append(Paragraph(inline_markup(stripped[3:]), styles['H1Custom']))
            continue
        if stripped.startswith('### '):
            story.append(Paragraph(inline_markup(stripped[4:]), styles['H2Custom']))
            continue
        if stripped.startswith('- '):
            story.append(Paragraph('&bull; ' + inline_markup(stripped[2:]), styles['BulletCustom']))
            continue
        if len(stripped) > 2 and stripped[0].isdigit() and stripped[1] == '.':
            story.append(Paragraph(inline_markup(stripped), styles['NumberCustom']))
            continue
        if stripped.endswith('?') and not stripped.startswith('http'):
            story.append(Paragraph(inline_markup(stripped), styles['H2Custom']))
            continue
        if stripped.startswith('Коротко:') or stripped.startswith('Очень простое объяснение:'):
            story.append(Paragraph(inline_markup(stripped), styles['QuoteCustom']))
            continue
        story.append(Paragraph(inline_markup(stripped), styles['BodyCustom']))

    return story


def main():
    md_text = SOURCE.read_text(encoding='utf-8')
    doc = SimpleDocTemplate(
        str(TARGET),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title='СМЫСЛ — шпаргалка к защите проекта',
        author='Codex',
    )
    doc.build(build_story(md_text), onFirstPage=page_number, onLaterPages=page_number)
    print(TARGET)


if __name__ == '__main__':
    main()
