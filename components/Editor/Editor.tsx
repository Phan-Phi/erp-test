import React, { useRef } from "react";
import { Editor as TinyMCEEditor, IAllProps } from "@tinymce/tinymce-react";

type ExcludeProps = "init" | "apiKey";

interface EditorProps extends Omit<IAllProps, ExcludeProps> {
  height?: string | number | undefined;
}

const Editor = (props: EditorProps) => {
  const { height, ...restProps } = props;
  const editorRef = useRef<TinyMCEEditor | null>(null);

  return (
    <TinyMCEEditor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_KEY}
      ref={(ref) => {
        editorRef.current = ref;
      }}
      init={{
        resize: false,
        height,
        plugins: [
          "file",
          "advlist",
          "autolink",
          "lists",
          "link",
          "image",
          "charmap",
          "preview",
          "anchor",
          "searchreplace",
          "visualblocks",
          "code",
          "fullscreen",
          "insertdatetime",
          "media",
          "table",
          "code",
          "help",
          "wordcount",
        ],

        images_file_types: "jpg,svg,webp",
        toolbar:
          "undo redo | blocks | fontfamily | fontsize | " +
          "bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | help",
        file_picker_types: "image",
        file_picker_callback: (cb, value, meta) => {
          const input = document.createElement("input");
          input.setAttribute("type", "file");
          input.setAttribute("accept", "image/*");

          input.addEventListener("change", (e) => {
            const _e = e as unknown as React.ChangeEvent<HTMLInputElement>;

            const files = _e.target.files;

            if (files == null) return;

            const file = files[0];
            const reader = new FileReader();

            reader.addEventListener("load", () => {
              const editor = editorRef.current;

              if (editor == null) return;

              const id = "blobid" + new Date().getTime();
              const blobCache = editor.editor?.editorUpload.blobCache;

              if (blobCache == null) return;

              const readerResult = reader.result;

              if (typeof readerResult === "string") {
                const base64 = readerResult.split(",")[1];
                const blobInfo = blobCache.create(id, file, base64);
                blobCache.add(blobInfo);
                cb(blobInfo.blobUri(), { title: file.name });
              }
            });

            reader.readAsDataURL(file);
          });

          input.click();
        },

        content_style: "body { font-family: Helvetica,Arial,sans-serif; font-size:12pt }",
      }}
      {...restProps}
    />
  );
};

export default Editor;
