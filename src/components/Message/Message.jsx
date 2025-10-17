import { useEffect, useState } from "react";
import "./Message.css";
import { EllipsisVertical, Trash2, Edit3 } from "lucide-react";
import { useRef } from "react";
import useMessaging from "../../hook/useMessaging";

// handle content type when rendering
const MessageContent = ({ type, content, onImageLoad }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fileDetails, setFileDetails] = useState({});
  let message;

  useEffect(() => {
    // if message is a file/image, convert it from JSON format
    if (type === "FILE") {
      const details = JSON.parse(content);
      setFileDetails(details);
      setIsLoading(false);
    }
  }, [type, content]);

  if (type === "TEXT") {
    message = <div className="message--text">{content}</div>;
  } else if (type === "FILE" && fileDetails) {
    if (isLoading) return <div>File loading...</div>;
    else if (fileDetails?.mimetype?.startsWith("image/")) {
      message = (
        <div className="message--image image-wrapper">
          {fileDetails?.url ? (
            <img
              src={fileDetails?.url || "#"}
              alt={fileDetails?.filename}
              onLoad={onImageLoad}
            />
          ) : (
            <div style={{ color: "red" }}>Fail to load image</div>
          )}
        </div>
      );
    } else {
      message = (
        <div className="message--file file-wrapper message--text">
          <a href={fileDetails?.url} target="_blank" rel="noopener noreferrer">
            {fileDetails?.filename}
          </a>
        </div>
      );
    }
  }

  return <>{message}</>;
};

// 'type' text, img.
// 'content' text content or image url.
// 'label' indicate who the message coming from (SELF, OTHER)
const Message = ({ message, isSender, onImageLoad }) => {
  const [isMessageOptionOn, setIsMessageOptionOn] = useState(false);
  const optionsButtonRef = useRef(null);
  const popupRef = useRef(null);
  const { deleteMessage } = useMessaging();

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        optionsButtonRef.current &&
        !optionsButtonRef.current.contains(event.target)
      ) {
        setIsMessageOptionOn(false);
      }
    };

    if (isMessageOptionOn) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMessageOptionOn]);

  const handleDeleteMessage = () => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      deleteMessage(message.id);
      setIsMessageOptionOn(false);
    }
  };

  return (
    <>
      {isSender ? (
        <div className="message message--self">
          <div
            className={`icon-container icon message-options ${isMessageOptionOn ? "message-options--on" : "message-options--off"}`}
            onClick={() => setIsMessageOptionOn((prev) => !prev)}
            ref={optionsButtonRef}
          >
            <EllipsisVertical size={16} />
            <div className="message-options-list" ref={popupRef}>
              <div
                className="message-options--delete-message"
                onClick={handleDeleteMessage}
              >
                Delete
              </div>
            </div>
          </div>

          <MessageContent
            type={message?.type}
            content={message?.content}
            onImageLoad={onImageLoad}
          />
        </div>
      ) : (
        <div className="message message--other">
          <div className="message__grid-wrapper">
            <div className="message__username">
              {"@" + message?.sender?.username}
            </div>
            <div className="message__content">
              <MessageContent
                type={message?.type}
                content={message?.content}
                onImageLoad={onImageLoad}
              />
            </div>
            <div className="message__profile">
              <img
                src={
                  message?.sender?.profileUrl
                    ? message?.sender?.profileUrl
                    : "/user.png"
                }
                alt=""
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Message;
