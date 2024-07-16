/* eslint-disable @next/next/no-img-element */
"use client"

import * as React from "react"
import { ImageIcon, XIcon } from "lucide-react"

export function ImagePicker({
  urlValue,
  onValueChange,
}: {
  urlValue?: string
  onValueChange: (newUrlValue?: string) => void
}) {
  const [imageFile, setImageFile] = React.useState<File | null>(null)

  const inputRef = React.useRef<HTMLInputElement | null>(null)

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files

    if (!files || !files.item(0)) return

    const image = files.item(0)

    if (!image) return

    setImageFile(image)

    const reader = new FileReader()

    reader.onloadend = () => {
      onValueChange(reader.result as string)
    }

    reader.readAsDataURL(image)
  }

  const handleRemove = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    onValueChange("")
    setImageFile(null)
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

        {urlValue && imageFile && (
          <>
            <img
              src={urlValue}
              alt={imageFile.name}
              className="size-full object-contain"
            />
          </>
        )}
      </label>
      {urlValue && imageFile && (
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
