/* eslint react/forbid-prop-types: 0 */
import React from "react";
import { bool, func, shape, string, object } from "prop-types";
import Dropzone from "react-dropzone";
import Pica from "pica/dist/pica";
import shortUuid from "short-uuid";
import uuidv5 from "uuid/v5";
import sanitizeFilename from "sanitize-filename";
import { Storage } from "aws-amplify";

import {
  Actionbar,
  Action,
  CharacterCount,
  Container,
  Form,
  FormItem,
  Label,
  Legend,
  Separator,
  TextInput,
} from "interviewjs-styleguide";

import validateField from "./validateField";

const fileToKey = (data, storyId) => {
  const { name, type } = data;
  // console.log(name, type);

  let namespace = storyId;
  if (namespace.indexOf("_")) namespace = namespace.split("_").pop();
  if (namespace.length < 36) namespace = shortUuid().toUUID(namespace);

  const uuid = uuidv5(`${type},${name}`, namespace);
  return `${shortUuid().fromUUID(uuid)}-${name}`;
};

export default class MetaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        ...this.props.story,
        author: this.props.story.author,
        authorLink: this.props.story.authorLink,
        cover: this.props.story.cover,
        logo: this.props.story.logo,
        pubDate: this.props.story.pubDate,
        title: this.props.story.title,
      },
      formValidation: {
        title: null,
      },
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    if (e) e.preventDefault();
    this.props.handleSubmit(this.state.formData);
  }

  handleBlur(e) {
    const { target } = e;
    const { name } = target;
    this.setState({
      formValidation: {
        ...this.state.formValidation,
        [name]: validateField(target),
      },
    });
    return this.props.handleSave && validateField(target)
      ? this.props.handleSave({ [name]: this.state.formData[name] })
      : null;
  }

  handleChange(e) {
    this.setState({
      formData: { ...this.state.formData, [e.target.name]: e.target.value },
    });
  }

  handleFile(key, f) {
    const { type, preview, name } = f[0];
    const offScreenImage = document.createElement("img");
    offScreenImage.addEventListener("load", () => {
      const maxWidth = key === "logo" ? 500 : 1000;
      console.log(key, maxWidth);
      const targetWidth = offScreenImage.width > maxWidth ? maxWidth : offScreenImage.width;
      const targetHeight = parseInt(targetWidth * offScreenImage.height / offScreenImage.width, 10);
      console.log(`${offScreenImage.width} x ${offScreenImage.height} => ${targetWidth} x ${targetHeight}`);

      const offScreenCanvas = document.createElement("canvas");
      offScreenCanvas.width = targetWidth;
      offScreenCanvas.height = targetHeight;

      const pica = Pica({ features: ["js", "wasm", "ww"] });
      pica
        .resize(offScreenImage, offScreenCanvas, {
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2,
          transferable: true,
        })
        .then(result => pica.toBlob(result, "image/jpeg", 0.9))
        .then(blob => {
          // const reader = new FileReader();
          // reader.onloadend = () => {
          //   console.log("data url length", reader.result.length);
          //   const base64data = reader.result.length > 3e6 ? "" : reader.result;
          //   this.setState({
          //     formData: { ...this.state.formData, [key]: base64data }
          //   });
          // };
          // reader.readAsDataURL(blob);
          const fkey = fileToKey({ type, name: sanitizeFilename(name.replace(/ /g, "_")) }, this.props.story.id);
          Storage.put(`files/${this.props.user.id}/${this.props.story.id}/${fkey}`, blob, {
            bucket: "data.interviewjs.io",
            level: "public",
            contentType: type,
          })
            .then(async result => {
              console.log(result);
              this.setState({
                formData: {
                  ...this.state.formData,
                  [key]: `https://story.interviewjs.io/files/${this.props.user.id}/${this.props.story.id}/${fkey}`,
                },
              });
            })
            .catch(err => console.log(err));
          //
        })
        .catch(error => console.log(error));
    });
    offScreenImage.src = preview;
  }

  render() {
    return (
      <Form onSubmit={e => this.handleSubmit(e)}>
        <FormItem>
          <Label>Title</Label>
          <CharacterCount>{60 - this.state.formData.title.length}</CharacterCount>
          <TextInput
            input
            maxLength="60"
            minLength="5"
            name="title"
            onBlur={e => this.handleBlur(e)}
            onChange={e => this.handleChange(e)}
            placeholder="Make it short and simple!"
            required
            valid={this.state.formValidation.title}
            value={this.state.formData.title}
          />
          <Legend tip="Short and simple titles work best.">i</Legend>
        </FormItem>
        <Separator size="m" silent />

        <Container dir="row">
          <Container flex={[0, 0, `${100 / 3}%`]}>
            <FormItem>
              <Label>Byline</Label>
              <CharacterCount>{35 - this.state.formData.author.length}</CharacterCount>
              <TextInput
                input
                maxLength="35"
                name="author"
                onBlur={e => this.handleBlur(e)}
                onChange={e => this.handleChange(e)}
                place="left"
                required={this.props.required}
                placeholder="Author’s name"
                value={this.state.formData.author}
              />
              <Legend tip="Add the author’s name">i</Legend>
            </FormItem>
          </Container>
          <Container flex={[0, 0, `${100 / 3}%`]}>
            <FormItem>
              <TextInput
                input
                name="authorLink"
                onBlur={e => this.handleBlur(e)}
                onChange={e => this.handleChange(e)}
                place="middle"
                placeholder="Link"
                required={this.props.required}
                value={this.state.formData.authorLink}
              />
              <Legend tip="Add a link e.g. to your website">i</Legend>
            </FormItem>
          </Container>
          <Container flex={[0, 0, `${100 / 3}%`]}>
            <FormItem>
              <TextInput
                input
                maxLength="35"
                name="pubDate"
                onBlur={e => this.handleBlur(e)}
                onChange={e => this.handleChange(e)}
                place="right"
                placeholder="Date of publication"
                required={this.props.required}
                value={this.state.formData.pubDate}
              />
              <Legend tip="Add the publication date">i</Legend>
            </FormItem>
          </Container>
        </Container>
        <Separator size="m" silent />
        <Container dir="row">
          <Container flex={[1, 1, "50%"]}>
            <FormItem>
              <Label>Cover photo</Label>
              <Dropzone
                accept="image/jpeg, image/jpg, image/svg, image/gif, image/png"
                ref={node => {
                  this.dropzoneRef = node;
                }}
                onDrop={accepted => {
                  this.handleFile("cover", accepted);
                }}
                style={{ display: "none" }}
              >
                <p>Drop file here</p>
              </Dropzone>
              {this.state.formData && this.state.formData.cover ? (
                <img src={this.state.formData.cover} alt="Cover Preview" style={{ width: "100%" }} />
              ) : null}
              <TextInput
                file
                place="left"
                onClick={() => {
                  this.dropzoneRef.open();
                }}
              />
              <Legend tip="Choose a photo if you want a “front page” but make sure you have the copyright!">i</Legend>
            </FormItem>
          </Container>
          <Container flex={[1, 1, "50%"]}>
            <FormItem>
              <Label>Your logo</Label>
              <Dropzone
                accept="image/jpeg, image/jpg, image/svg, image/gif, image/png"
                ref={node => {
                  this.dropzoneRef2 = node;
                }}
                onDrop={accepted => {
                  this.handleFile("logo", accepted);
                }}
                style={{ display: "none" }}
              >
                <p>Drop file here</p>
              </Dropzone>
              {this.state.formData && this.state.formData.logo ? (
                <img src={this.state.formData.logo} alt="Logo Preview" style={{ width: "100%" }} />
              ) : null}
              <TextInput
                file
                place="right"
                onClick={() => {
                  this.dropzoneRef2.open();
                }}
              />
              <Legend tip="Add your organisation’s logo">i</Legend>
            </FormItem>
          </Container>
        </Container>
        <Separator size="m" silent />
        <Actionbar>
          <Action fixed primary type="submit">
            {this.props.cta}
          </Action>
        </Actionbar>
      </Form>
    );
  }
}

MetaForm.propTypes = {
  cta: string,
  required: bool,
  handleSave: func,
  handleSubmit: func.isRequired,
  user: object.isRequired,
  story: shape({
    id: string,
    author: string,
    authorLink: string,
    cover: string,
    logo: string,
    pubDate: string,
    title: string,
  }),
};

MetaForm.defaultProps = {
  cta: "Save",
  handleSave: null,
  required: false,
  story: {
    id: shortUuid().fromUUID(shortUuid.uuid()),
    author: "",
    authorLink: "",
    cover: "",
    logo: "",
    pubDate: "",
    title: "",
  },
};
