/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import { ImageIcon, XIcon } from "lucide-react"

export function ImagePicker() {
  const [imageFile, setImageFile] = React.useState<File | null>(null)

  const [previewSrc, setPreviewSrc] = React.useState("")

  const [imageLoading, setImageLoading] = React.useState(false)

  const inputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (!imageFile) return

    setImageLoading(true)

    const reader = new FileReader()

    reader.onloadend = () => {
      setPreviewSrc(reader.result as string)

      setImageLoading(false)
    }

    reader.readAsDataURL(imageFile)
  }, [imageFile])

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files

    if (!files || !files.item(0)) return

    setImageFile(files.item(0))
  }

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setImageFile(null)
    setPreviewSrc("")
  }

  return (
    <div className="relative">
      <input
        type="file"
        name="file"
        id="file"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        hidden
        onChange={handleChange}
        ref={inputRef}
        key={imageFile?.name}
      />
      <label
        htmlFor="file"
        title="Choose an image"
        className="inline-flex aspect-square size-full cursor-pointer items-center justify-center overflow-hidden rounded-md border text-muted-foreground transition-opacity hover:opacity-60"
      >
        <span className="sr-only">choose an image</span>
        {!imageFile && <ImageIcon className="size-6 text-border" />}

        {previewSrc && imageFile && (
          <>
            <img
              src={previewSrc}
              alt={imageFile.name}
              className="size-full object-contain"
            />
          </>
        )}
      </label>
      {previewSrc && imageFile && (
        <button
          className="absolute right-1 top-1 z-20 rounded-full bg-red-500 p-px text-white hover:bg-red-600"
          aria-label="remove image"
          onClick={handleRemove}
        >
          <XIcon className="size-4" />
        </button>
      )}
    </div>
  )
}
