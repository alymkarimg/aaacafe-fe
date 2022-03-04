import React, {
  useState,
  Fragment,
  useRef,
  useEffect,
  ChangeEvent,
} from "react";
import { useLocation } from "react-router";
import * as CKeditorMain from "@ckeditor/ckeditor5-react";
import InlineEditor from "@ckeditor/ckeditor5-build-inline/build/ckeditor.js";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../redux";
import { Link } from "react-router-dom";
import "./EditableArea.scss";
import TextField from "../textfield/Textfield";

const { CKEditor } = CKeditorMain;

var editorConfig = {
  toolbar: [
    "link",
    "list",
    "alignment",
    "blockQuote",
    "bold",
    "code",
    "codeBlock",
    "selectAll",
    "undo",
    "redo",
    "fontBackgroundColor",
    "fontColor",
    "fontFamily",
    "fontSize",
    "heading",
    "highlight",
    "removeHighlight",
    "horizontalLine",
    "imageUpload",
    "indent",
    "outdent",
    "italic",
    "link",
    "numberedList",
    "bulletedList",
    "mediaEmbed",
    "pageBreak",
    "removeFormat",
    "specialCharacters",
    "strikethrough",
    "subscript",
    "superscript",
    "insertTable",
    "todoList",
    "underline",
    "htmlEmbed",
    "simpleBox",
  ],
  image: {
    toolbar: [
      "imageStyle:full",
      "imageStyle:side",
      "|",
      "imageTextAlternative",
    ],
  },
  allowedContent: true,
  link: {
    decorators: {
      openInNewTab: {
        mode: "manual",
        label: "Open in a new tab",
        attributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      },
    },
  },
  table: {
    contentToolbar: [
      "tableColumn",
      "tableRow",
      "mergeTableCells",
      "tableCellProperties",
      "tableProperties",
    ],
  },
  heading: {
    options: [
      { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
      {
        model: "paragraph",
        title: "Paragraph 2",
        class: "ck-heading_paragraph",
      },
      {
        model: "heading1",
        view: "h1",
        title: "Heading 1",
        class: "ck-heading_heading1",
      },
      {
        model: "heading2",
        view: "h2",
        title: "Heading 2",
        class: "ck-heading_heading2",
      },
      {
        model: "heading3",
        view: "h3",
        title: "Heading 3",
        class: "ck-heading_heading3",
      },
    ],
  },
  removePlugins: ["Title"],
  mediaEmbed: {
    previewsInData: true,
  },
};

interface Props {
  truncate?: number;
  style?: object;
  pathname: string;
  guid: string;
}

const EditableArea: React.FC<Props> = ({ truncate, style, pathname, guid }) => {
  const editableAreas = useSelector((state: State) => state.edit).editableAreas;
  const isEdit = useSelector((state: State) => state.edit).edit;

  const location = useLocation();

  const [values, setValues] = useState({
    data: "",
    link: "",
    url: pathname ? pathname : location.pathname,
  });

  const { link, data, url } = values;

  // find data from array of models and populate on page load
  useEffect(() => {
    const editableArea = editableAreas.find(
      (q) => q.pathname === url && q.guid === guid
    );
    if (editableArea) {
      setValues({ ...values, data: editableArea.data });
    } else {
      // TODO: create editable area
    }
  }, [editableAreas]);

  // handle link changing
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValues({ ...values, link: e.target.value });
  };

  // add truncate functions to the Class string. AK not sure if this is Class?

  if (!Object.getPrototypeOf(String).countWords) {
    String.prototype.truncateWords = function (wordCount: number): string {
      if (this.split(" ").length > wordCount) {
        return this.split(" ").slice(0, wordCount).join(" ") + "...";
      } else {
        return this.toString();
      }
    };
  }

  if (isEdit) {
    return (
      <article style={style}>
        <TextField
          id={`editableAreaInput ${guid}`}
          type={"text"}
          onChange={handleChange}
          value={link}
          placeholder={"Url"}
        />
        <CKEditor
          data-pathname={pathname}
          id={guid}
          className={`editableAreaContainer ${guid}`}
          editor={InlineEditor}
          config={editorConfig}
          data={data}
          onChange={(evt: ChangeEvent, editor: typeof CKeditorMain): void => {
            setValues({ ...values, data: editor.getData() });
          }}
          onReady={(editor: typeof CKeditorMain): void => {
            editor.plugins.get("FileRepository").createUploadAdapter =
              (loader: {
                file: File;
                uploadTotal: number;
                uploaded: number;
              }): MyUploadAdapter => {
                return new MyUploadAdapter(loader);
              };
          }}
        />
      </article>
    );
  } else {
    return (
      <Link to={link || "#"} className={`editableAreaContainer ${guid}`}>
        <article
          dangerouslySetInnerHTML={{
            __html: truncate ? data.truncateWords(truncate) : data,
          }}
        ></article>
      </Link>
    );
  }
};

class MyUploadAdapter {
  private loader: {
    file: File;
    uploadTotal: number;
    uploaded: number;
  };
  private url: string;
  private xhr: XMLHttpRequest = new XMLHttpRequest();

  constructor(loader: { file: File; uploadTotal: number; uploaded: number }) {
    // CKEditor 5's FileLoader instance.
    this.loader = loader;

    // URL where to send files.
    this.url = `${
      process.env.REACT_APP_API
    }/editable-area/upload-image?token=${"/somethinggoeshere"}`;
  }

  // Starts the upload process.
  async upload(): Promise<object> {
    return await new Promise((resolve, reject) => {
      this._initRequest();
      this._initListeners(resolve, reject);
      this._sendRequest();
    });
  }

  // Aborts the upload process.
  abort(): void {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  // Example implementation using XMLHttpRequest.
  _initRequest(): void {
    const xhr = (this.xhr = new XMLHttpRequest());

    xhr.open("POST", this.url, true);
    xhr.responseType = "json";
  }

  // Initializes XMLHttpRequest listeners.
  _initListeners(
    resolve: (value: object) => void,
    reject: (errorText?: string) => void
  ): void {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = `Couldn't upload file: ${loader.file.name}.`;

    xhr.addEventListener("error", () => reject(genericErrorText));
    xhr.addEventListener("abort", () => reject());
    xhr.addEventListener("load", () => {
      const response = xhr.response;

      if (!response || response.error) {
        return reject(
          response && response.error ? response.error.message : genericErrorText
        );
      }

      // If the upload is successful, resolve the upload promise with an object containing
      // at least the "default" URL, pointing to the image on the server.
      resolve({
        default: response,
      });
    });

    if (xhr.upload) {
      xhr.upload.addEventListener("progress", (evt: ProgressEvent) => {
        if (evt.lengthComputable) {
          loader.uploadTotal = evt.total;
          loader.uploaded = evt.loaded;
        }
      });
    }
  }

  // Prepares the data and sends the request.
  async _sendRequest(): Promise<void> {
    const data = new FormData();

    data.append("upload", await Promise.resolve(this.loader.file));

    this.xhr.send(data);
  }
}

export default EditableArea;
