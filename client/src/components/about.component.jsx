import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { getFullDay } from "../common/date";
import { Strings } from "@/support/Constants";
import { dateFormat } from "@/support/Utils";
import { StoreContext } from "@/stores/Store";

const AboutUser = ({ className, bio, social_links, joinedAt, lang }) => {

  return (
    <div className={"md:w-[90%] md:mt-7 " + className}>
      <p className="text-xl leading-7">
        {bio ? bio : Strings.nothingToRead[lang]}
      </p>
      <div className="flex gap-x-7 gap-y-2 flex-wrap my-7 items-center text-dark-grey">
        {social_links && Object.keys(social_links).map((key) => {
          let link = social_links[key];
          return link ? (
            <Link to={link} key={key} target="_blank">
              <i
                className={
                  "fi " +
                  (key !== "website" ? "fi-brands-" + key : "fi-rr-globe") +
                  " text-2xl hover:text-black"
                }
              ></i>
            </Link>
          ) : (
            " "
          );
        })}
      </div>
      <p className="text-xl leading-7 text-dark-grey">{Strings.joinedOn[lang]} {dateFormat(joinedAt)}</p>
    </div>
  );
};

export default AboutUser;
