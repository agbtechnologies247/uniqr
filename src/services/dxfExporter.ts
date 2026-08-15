import { QrEngine } from './qrEngine';

export class DxfExporter {
  /**
   * Converts a QR code into AutoCAD DXF format for CAD, CNC, Laser Cutting, and Engraving
   */
  static async generateDXF(text: string, title: string = 'UNIQR-LASER-CUT'): Promise<string> {
    const matrix = await QrEngine.getQrMatrix(text);
    const n = matrix.length;
    const moduleWidth = 2.0; // 2mm per QR module in CAD units

    let dxf = `0
SECTION
2
HEADER
9
$ACADVER
1
AC1014
0
ENDSEC
0
SECTION
2
TABLES
0
TABLE
2
LAYER
70
1
0
LAYER
2
QR_CUT_LAYER
70
0
62
7
6
CONTINUOUS
0
ENDTAB
0
ENDSEC
0
SECTION
2
ENTITIES
`;

    // Loop matrix and add LWPOLYLINE closed squares for each TRUE module
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (matrix[r][c]) {
          // CAD Y is inverted compared to Canvas Y
          const x1 = c * moduleWidth;
          const y1 = (n - r) * moduleWidth;
          const x2 = x1 + moduleWidth;
          const y2 = y1 - moduleWidth;

          dxf += `0
LWPOLYLINE
5
${(r * n + c + 100).toString(16)}
8
QR_CUT_LAYER
90
4
70
1
10
${x1.toFixed(4)}
20
${y1.toFixed(4)}
10
${x2.toFixed(4)}
20
${y1.toFixed(4)}
10
${x2.toFixed(4)}
20
${y2.toFixed(4)}
10
${x1.toFixed(4)}
20
${y2.toFixed(4)}
`;
        }
      }
    }

    dxf += `0
ENDSEC
0
EOF
`;

    return dxf;
  }

  /**
   * Downloads the text string as a .dxf file
   */
  static downloadDXF(dxfContent: string, filename: string = 'uniqr-laser-cut.dxf') {
    const blob = new Blob([dxfContent], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
