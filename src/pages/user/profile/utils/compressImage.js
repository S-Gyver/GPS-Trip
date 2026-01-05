/**
 * compressImage
 * - resize รูปให้ด้านยาวสุดไม่เกิน maxSize px
 * - บีบคุณภาพ JPEG
 * - return เป็น File ใหม่
 */
export async function compressImage(
  file,
  {
    maxSize = 512,      // px
    quality = 0.75,     // 0-1
    mimeType = 'image/jpeg',
  } = {}
) {
  // ถ้าไม่ใช่รูป ให้คืนไฟล์เดิม
  if (!file.type.startsWith('image/')) return file

  const img = new Image()
  const url = URL.createObjectURL(file)

  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = url
  })

  let { width, height } = img

  // คำนวณสัดส่วน
  if (width > height) {
    if (width > maxSize) {
      height = Math.round((height * maxSize) / width)
      width = maxSize
    }
  } else {
    if (height > maxSize) {
      width = Math.round((width * maxSize) / height)
      height = maxSize
    }
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, mimeType, quality)
  )

  URL.revokeObjectURL(url)

  return new File(
    [blob],
    file.name.replace(/\.\w+$/, '.jpg'),
    { type: mimeType }
  )
}
