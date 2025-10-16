import { UseUser } from "@/providers/AuthProvider";
import { useState } from "react";

const Comment = () => {
  const { token } = UseUser();
  const [getCom, setGetCom] = useState([]);
  const getComment = async () => {
    const coooms = await fetch(`http://localhost:5555/Comment/Get/${postId}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const response = await coooms.json();
    setGetCom(response);
  };

  const writeComment = async () => {
    const coooms = await fetch(`http://localhost:5555/Comment/Create`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        comment:
      })
    });
    const response = await coooms.json();
    setGetCom(response);
  };

  return <div></div>;
};

export default Comment;
