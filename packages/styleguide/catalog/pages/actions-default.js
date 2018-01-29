import React from "react";
import { markdown, ReactSpecimen } from "catalog";

import { Action, Icon } from "../components";

export default () => markdown`
  ## Primary Actions

  ### Rendered as buttons

  ${(
    <ReactSpecimen span={3}>
      <Action primary onClick={evt => console.log(evt)}>
        Primary action
      </Action>
    </ReactSpecimen>
  )}
  ${(
    <ReactSpecimen span={3}>
      <Action primary onClick={evt => console.log(evt)}>
        Primary action that can go onto two lines
      </Action>
    </ReactSpecimen>
  )}

  ### Rendered as links

  ${(
    <ReactSpecimen span={3}>
      <Action primary href="https://fb.com" target="_blank">
        <Icon name="facebook" /> &nbsp; Primary Action
      </Action>
    </ReactSpecimen>
  )}
  ${(
    <ReactSpecimen span={3}>
      <Action primary iconic href="https://fb.com" target="_blank">
        <Icon name="facebook" />
      </Action>
    </ReactSpecimen>
  )}

  ## Secondary Actions

  ### Rendered as buttons

  ${(
    <ReactSpecimen span={3}>
      <Action secondary onClick={evt => console.log(evt)}>
        Secondary action
      </Action>
    </ReactSpecimen>
  )}
  ${(
    <ReactSpecimen span={3}>
      <Action secondary onClick={evt => console.log(evt)}>
        Secondary action that can go onto two lines
      </Action>
    </ReactSpecimen>
  )}

  ### Rendered as links

  ${(
    <ReactSpecimen span={3}>
      <Action secondary href="https://fb.com" target="_blank">
        <Icon name="facebook" /> &nbsp; Secondary Action
      </Action>
    </ReactSpecimen>
  )}
  ${(
    <ReactSpecimen span={3}>
      <Action secondary iconic href="https://fb.com" target="_blank">
        <Icon name="facebook" />
      </Action>
    </ReactSpecimen>
  )}

  ## Plain Actions

  ### Rendered as buttons

  ${(
    <ReactSpecimen span={3}>
      <Action onClick={evt => console.log(evt)}>Secondary action</Action>
    </ReactSpecimen>
  )}
  ${(
    <ReactSpecimen span={3}>
      <Action onClick={evt => console.log(evt)}>
        Secondary action wouldn’t go onto two lines
      </Action>
    </ReactSpecimen>
  )}

  ### Rendered as links

  ${(
    <ReactSpecimen span={3}>
      <Action href="https://fb.com" target="_blank">
        <Icon name="facebook" /> &nbsp; Secondary Action
      </Action>
    </ReactSpecimen>
  )}
  ${(
    <ReactSpecimen span={3}>
      <Action href="https://fb.com" target="_blank">
        <Icon name="facebook" />
      </Action>
    </ReactSpecimen>
  )}
`;
