/* eslint react/prefer-stateless-function: 0 */

import { cloneElement } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import * as actionCreators from "./actions/actionCreators";

const mapStateToProps = state => ({
  stories: state.stories,
  user: state.user,
});

const mapDispatchToProps = dispatch => bindActionCreators(actionCreators, dispatch);

const Main = props => cloneElement(props.children, props);
export default connect(mapStateToProps, mapDispatchToProps)(Main); // Main
