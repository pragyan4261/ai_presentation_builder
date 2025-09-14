"use client";
import React from 'react'
import { FileUploaderRegular } from '@uploadcare/react-uploader/next';
import '@uploadcare/react-uploader/core.css';

type Props = {
  contentId:string
  onContentChange:(
    contentId:string,
    newContent:string | string[] | string[][]
  )=>void
}

const UploadImage = ({
  contentId,onContentChange
}: Props) => {
  const handleChangeEvent = (e:{cdnUrl:string | string[] | string[][]}) => {
       onContentChange(contentId,e.cdnUrl)
  }

  return (
    <div>
      <FileUploaderRegular
        sourceList="local, gdrive"
        classNameUploader="uc-purple"
         pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_API_KEY!}
         multiple={false}
         onFileUploadSuccess={handleChangeEvent}
         maxLocalFileSizeBytes={10000000}
      />
    </div>
  )
}

export default UploadImage