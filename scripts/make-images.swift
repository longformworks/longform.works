// 生成 public/og.png（1200×630）与 public/apple-touch-icon.png（180×180）。
// 运行：swiftc -O -o /tmp/mkimg scripts/make-images.swift -framework AppKit && /tmp/mkimg
import AppKit

let paper = NSColor(red: 0xEE/255.0, green: 0xF1/255.0, blue: 0xF5/255.0, alpha: 1)
let sealInk = NSColor(red: 0xF4/255.0, green: 0xF6/255.0, blue: 0xFA/255.0, alpha: 1)
let ink = NSColor(red: 0x0B/255.0, green: 0x12/255.0, blue: 0x20/255.0, alpha: 1)
let inkSoft = NSColor(red: 0x55/255.0, green: 0x60/255.0, blue: 0x7A/255.0, alpha: 1)
let seal = NSColor(red: 0xA3/255.0, green: 0x1F/255.0, blue: 0x34/255.0, alpha: 1)

func sealPath(in r: NSRect) -> NSBezierPath {
    NSBezierPath(roundedRect: r, xRadius: r.width * 0.035, yRadius: r.width * 0.035)
}
// 用与网页相同的思源宋体（.cache/fonts，见 scripts/subset-fonts.mjs 顶部说明）
let notoURL = URL(fileURLWithPath: ".cache/fonts/NotoSerifCJKsc-SemiBold.otf")
CTFontManagerRegisterFontsForURL(notoURL as CFURL, .process, nil)
func drawSeal(in r: NSRect) {
    seal.setFill(); sealPath(in: r).fill()
    let font = NSFont(name: "NotoSerifCJKsc-SemiBold", size: r.height * 0.62) ?? NSFont(name: "STSongti-SC-Bold", size: r.height * 0.62) ?? NSFont.systemFont(ofSize: r.height * 0.62, weight: .semibold)
    let s = NSAttributedString(string: "长", attributes: [.font: font, .foregroundColor: sealInk])
    let ss = s.size()
    s.draw(at: NSPoint(x: r.midX - ss.width / 2, y: r.midY - ss.height / 2 + r.height * 0.02))
}
func save(_ image: NSImage, to path: String) {
    guard let tiff = image.tiffRepresentation, let rep = NSBitmapImageRep(data: tiff),
          let png = rep.representation(using: .png, properties: [:]) else { fatalError("encode \(path)") }
    try! png.write(to: URL(fileURLWithPath: path))
    print("wrote \(path)")
}

// OG：左上印章，「长作」大字，Longform Works 与一句介绍
do {
    let size = NSSize(width: 1200, height: 630)
    let img = NSImage(size: size)
    img.lockFocus()
    paper.setFill(); NSRect(origin: .zero, size: size).fill()
    CTFontManagerRegisterFontsForURL(URL(fileURLWithPath: ".cache/fonts/NotoSerifCJKsc-Regular.otf") as CFURL, .process, nil)
    let zhFont = NSFont(name: "NotoSerifCJKsc-Regular", size: 168) ?? NSFont.systemFont(ofSize: 168)
    let latinDesc = NSFont.systemFont(ofSize: 44, weight: .regular).fontDescriptor.withDesign(.serif)!
    let latinFont = NSFont(descriptor: latinDesc, size: 44)!
    let bodyFont = NSFont.systemFont(ofSize: 28, weight: .regular)
    let ps = NSMutableParagraphStyle(); ps.alignment = .left
    NSAttributedString(string: "长作", attributes: [.font: zhFont, .foregroundColor: ink, .paragraphStyle: ps, .kern: 10])
        .draw(at: NSPoint(x: 96, y: 300))
    NSAttributedString(string: "Longform Works", attributes: [.font: latinFont, .foregroundColor: ink, .paragraphStyle: ps])
        .draw(at: NSPoint(x: 100, y: 228))
    NSAttributedString(string: "Long-term projects, worked on a little at a time.", attributes: [.font: bodyFont, .foregroundColor: inkSoft, .paragraphStyle: ps])
        .draw(at: NSPoint(x: 100, y: 150))
    drawSeal(in: NSRect(x: 1200 - 96 - 72, y: 630 - 96 - 72, width: 72, height: 72))
    img.unlockFocus()
    save(img, to: "public/og.png")
}

// Touch icon
do {
    let px: CGFloat = 180
    let img = NSImage(size: NSSize(width: px, height: px))
    img.lockFocus()
    drawSeal(in: NSRect(x: 0, y: 0, width: px, height: px))
    img.unlockFocus()
    save(img, to: "public/apple-touch-icon.png")
}
