import React from "react";
import css from "styled-components";
import { array, bool, oneOfType, node, string } from "prop-types";

import { color, setHeight } from "../../../utils";

const CoverEl = css.div`
  background-color: ${color.black};
  background-image: url(${({ image }) => image});
  background-position: center center;
  background-size: cover;
  color: ${color.white};
  display: flex;
  flex-direction: column;
  min-height: 100px;
  position: relative;
  text-align: center;
`;

const CoverBody = css.div`
  background-color: ${color.shadowM};
  display: flex;
  flex-direction: column;
  flex: 1 0 0;
  justify-content: center;
  position: relative;
  &:after {
    ${setHeight("h")};
    background: linear-gradient(rgba(0,0,0,0), ${color.black});
    bottom: 0;
    content: " ";
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    z-index: 100;
  }
`;

const CoverSauce = css.div`
  position: relative;
  z-index: 200;
`;

const Cover = props => (
  <CoverEl {...props}>
    <CoverBody>
      {!props.compact ? <CoverSauce>{props.children}</CoverSauce> : null}
    </CoverBody>
  </CoverEl>
);

Cover.propTypes = {
  children: oneOfType([array, string, node]),
  compact: bool,
  image: node.isRequired
};

Cover.defaultProps = {
  children: null,
  compact: false
};

export default Cover;