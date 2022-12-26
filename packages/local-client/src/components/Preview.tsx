import "./styling/preview.css";
import { useRef, useEffect } from "react";

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
        <html>
        <head>
            <style>
            html { 
              background-color: #fff;
              color: black;
            }
            </style>
        </head>
            <body>
                <div id="root"></div>
                <script>
                const handleError = (err) => {
                    const root = document.querySelector('#root')
                    root.innerHTML = '<div style="color: red;"><h3> Runtime Error! </h3>' + err + '</div>'
                    console.error(err);
                  };
            
                  window.addEventListener('error', (event) => {
                    event.preventDefault();
                    handleError(event.error);
                  });
            
                  window.addEventListener('message', (event) => {
                    try {
                      eval(event.data);
                    }catch(err){
                      handleError(err);
                    }
                  }, false);
                </script>
            </body>
        </html>
    `;

const Preview = ({ code, err }: PreviewProps) => {
  const iframe = useRef<any>();

  useEffect(() => {
    iframe.current.srcdoc = html;
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 100);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        title="code preview"
        ref={iframe}
        srcDoc={html}
        sandbox="allow-scripts"
      />
      {err && <div className="preview-error">{err}</div>}
    </div>
  );
};

export default Preview;
