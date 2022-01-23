import MetaDecorator from "../components/Utils/MetaDecorator";
import React, { useEffect, useState, Fragment } from "react";
import InputHandler from "../components/Utils/InputHandler";
import ParagraphDisplay from "../components/Utils/ParagraphDisplay";
import Button from "../components/UI/Button";
import HomeLogo from "../components/HomeLogo";
import useUser from "../hooks/useUser";
import Loading from "../components/UI/Loading";
import Link from "next/link";
import axios from "axios";
import { authRoutes } from "../data/Routes";

const getParagraphFromText = (text) => {
  let paragraphs = text.split("\n\n");
  paragraphs = paragraphs.map((x) => x.split("\n"));
  return paragraphs;
};

export default function Home() {
  const [text, setText] = useState("");
  const [paragraphs, setParagraphs] = useState([]);
  const [isTyping, setIsTyping] = useState(true);

  const updateParagraphs = (text) => {
    const paragraphs = getParagraphFromText(text);
    if (paragraphs.length <= 1) {
      return;
    }

    if (paragraphs[paragraphs.length - 1][0].trim().length <= 0) {
      const unused = paragraphs.pop().join("\n");
      setText(unused);
    }
    addParagraphs(paragraphs);
  };

  useEffect(() => {
    if (!isTyping) return;
    updateParagraphs(text);
  }, [text]);

  const addParagraphs = (newP) => {
    setParagraphs((old) => {
      return [...old, ...newP];
    });
  };

  const toggleEditingState = () => {
    if (isTyping) {
      // Going to edit mode
      const newText = paragraphs.map((lines) => lines.join("\n")).join("\n\n");
      setText(newText);
      setParagraphs([]);
    } else {
      // Going to paragraph mode
      updateParagraphs(text + "\n\n"); // hacking around my system :)
    }
    setIsTyping(!isTyping);
  };

  const { loading, loggedIn, mutate } = useUser();

  if (loading) {
    return <Loading />;
  }

  return (
    <main className={"bg-gray-100 flex flex-col h-screen"}>
      <MetaDecorator
        title={"Home"}
        description={"Productivity application for writers"}
      />
      <HomeLogo />

      <span className={"fixed top-0 right-0 mt-3 mr-3 w-56"}>
        {loggedIn ? (
          <Fragment>
            <Button
              className="w-24 ml-auto"
              onClick={async () => {
                await axios.post(authRoutes.logout);
                mutate();
              }}
            >
              Logout
            </Button>
            <span>
              <h1 className={"text-right"}>Your Articles</h1>
            </span>
          </Fragment>
        ) : (
          <Fragment>
            <h3 className={"text-right"}>Login in to save your articles</h3>
            <Link href={"/login"}>
              <Button className="w-24 ml-auto">Login</Button>
            </Link>
          </Fragment>
        )}
      </span>

      <div className="mb-1 pt-0 w-full">
        <input
          type="text"
          placeholder="Document Heading"
          className="mx-auto font-bold block text-lg mt-4 w-full md:max-w-screen-sm lg:max-w-screen-md 2xl:max-w-screen-lg px-3 py-4 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-base border border-blueGray-300 w-full outline outline-1 outline-gray-300 focus:bg-white focus:border-blue-600 focus:outline-none"
        />
      </div>
      {isTyping && <ParagraphDisplay paragraphs={paragraphs} />}
      <InputHandler text={text} setText={setText} />
      <Button onClick={toggleEditingState} className={"mx-auto"}>
        {isTyping ? "Leave" : "Enter"} Typing Mode
      </Button>
    </main>
  );
}
