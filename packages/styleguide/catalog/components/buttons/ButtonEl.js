import css from "styled-components";
import Link from "gatsby-link";

import { color, font, radius, time, setSpace, setType } from "../../../utils";

const buttonBaseStyles = `
  ${setSpace("phm")};
  ${setSpace("pvs")};
  ${setType("x")};
  border-radius: ${radius.a};
  border: none;
  box-shadow: 0 2px 4px ${color.blackLt};
  cursor: pointer;
  display: inline-block;
  font-family: ${font.pri};
  outline: none;
  text-align: center;
  text-decoration: none;
  transition: background-color ${time.l}, box-shadow ${time.s}, color ${time.l};
  white-space: nowrap;
  &:active {
    box-shadow: 0 1px 2px ${color.blackHL};
  }
`;

const ButtonEl = css.button`
  ${buttonBaseStyles}
`;

export { ButtonEl };