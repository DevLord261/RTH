"use client";
import { hashingpassword } from "@/utils/hash";
import { useState } from "react";

export default function Home() {
  const [output, setOutput] = useState("");

  //these are the commands that i used to do the stuff
  const commands = {
    help: () =>
      "Available commands: help, hash <wordlist> ,crack <hash>, clear",
    greet: (name = "user") => `Hello, ${name}!`,
    clear: () => setOutput(""),

    // hash command which take args the apache_user.txt pass to the backend which is "/api/readfile" to hash the wordlist
    // and write it to new file called hashed.txt
    hash: async (wordlist?: string) => {
      if (!wordlist) wordlist = "apache_user.txt";
      try {
        const res = await fetch(`/api/readfile?file=${wordlist}`);
        if (!res.ok) return `file ${wordlist} not found.`;

        return `file "${wordlist}" is hashed`;
      } catch (err) {
        console.error(err);
        return [];
      }
    },

    // crack command which take a hash string and search the new file hashed.txt for any equal hashes and return the word correspond to it
    crack: async (hash: string) => {
      if (!hash) return "empty input";
      try {
        const res = await fetch(`api/crack?hash=${hash}`);
        if (!res) throw new Error("Failed to fetch");

        const result = await res.text();

        return result;
      } catch (err) {
        console.error(err);
        return [];
      }
    },
  };

  //just simple input text but when i trigger enter it takes the input split it and check if it exists in commands list
  // and if it exists run the command to trigger what it does
  const handleCommand = async (e) => {
    if (e.key === "Enter") {
      const input = e.target.value.trim();
      const [cmd, ...args] = input.split(" ");

      let result;
      if (commands[cmd]) {
        result = await commands[cmd](...args);
      } else {
        result = `Command not found: ${cmd}`;
      }

      if (cmd != "clear")
        setOutput((prevOutput) => `${prevOutput}\n> ${input}\n${result}`);
      e.target.value = "";
    }
  };

  return (
    <div className="container">
      {/* Background Video */}
      <video autoPlay muted loop id="bgVideo">
        <source src="/video/hacking.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Console UI */}
      <div id="console">
        <div style={{ fontSize: "16px" }}>Console RainbowTable App</div>
        <div id="output">{output}</div>
        <div className="test">
          <p id="begin">CSC465 ~ $</p>
          <input
            type="text"
            id="commandInput"
            autoFocus
            onKeyDown={handleCommand}
          />
        </div>
      </div>
    </div>
  );
}
