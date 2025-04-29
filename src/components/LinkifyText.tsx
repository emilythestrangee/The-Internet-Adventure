// LinkifyText.tsx
import React from "react";
import { linkifyText } from "../services/linkify";

interface LinkifyTextProps {
  text: string;
}

const LinkifyText: React.FC<LinkifyTextProps> = ({ text }) => {
  const matches = linkifyText(text);

  if (matches.length === 0) {
    return <span>{text}</span>;
  }

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach((match, idx) => {
    if (lastIndex < match.start) {
      elements.push(<span key={`text-${idx}`}>{text.slice(lastIndex, match.start)}</span>);
    }

    elements.push(
      <a
        key={`link-${idx}`}
        href={match.type === "email" ? `mailto:${match.text}` : match.text}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline break-all"
      >
        {match.text}
      </a>
    );

    lastIndex = match.end;
  });

  if (lastIndex < text.length) {
    elements.push(<span key="last">{text.slice(lastIndex)}</span>);
  }

  return <div className="whitespace-pre-wrap">{elements}</div>;
};

export default LinkifyText;
