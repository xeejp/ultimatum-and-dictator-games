import React, { Component } from 'react'
import { connect } from 'react-redux'

import {Card, CardActions, CardHeader, CardTitle, CardText} from 'material-ui/Card'
import Slider from 'material-ui/Slider'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActionSettings from 'material-ui/svg-icons/action/settings'
import Dialog from 'material-ui/Dialog';
import Chip from 'material-ui/chip'
import Toggle from 'material-ui/Toggle';

import { changeGameMode, changeGameRound, changeGameRedo, changeInfRedo } from './actions.js'
import { getGamemodeName } from 'util/index'

const mapStateToProps = ({ game_mode, game_round, page, game_redo, inf_redo}) => ({
  game_mode,
  game_round,
  game_redo,
  page,
  inf_redo,
})

const styles = {
  block: {
    margin: '20px 20px'
  },
  game_roundButton: {
    margin: 12,
  },
  game_modeButton: {
    margin: 0,
  },
};

class ExperimentSetting extends Component {
  constructor() {
    super()
    this.handleRoundInc = this.handleRoundInc.bind(this)
    this.handleRoundDec = this.handleRoundDec.bind(this)
    this.handleRedoInc = this.handleRedoInc.bind(this)
    this.handleRedoDec = this.handleRedoDec.bind(this)
    this.handleGameMode = this.handleGameMode.bind(this)
    this.handleOpen = this.handleOpen.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.handleConfirm = this.handleConfirm.bind(this)
    this.handleToggle = this.handleToggle.bind(this)
    this.state = {
      open: false,
      game_mode_temp: "ultimatum",
      game_round_temp: 1,
      game_redo_temp: 0,
      inf_redo_temp: false,
    }
  }
  componentDidMount() {
    const { game_mode, game_round, game_redo, inf_redo } = this.props
    this.setState({
      game_mode_temp: game_mode,
      game_round_temp: game_round,
      game_redo_temp: game_redo,
      inf_redo_temp: inf_redo,
    })
  }

  handleToggle = () => {
    const { inf_redo_temp } = this.state
    this.setState({inf_redo_temp: !inf_redo_temp})
  }

  handleOpen = () => {
    this.setState({open: true})
    const { game_mode, game_round, game_redo, inf_redo } = this.props
    this.setState({
      game_mode_temp: game_mode,
      game_round_temp: game_round,
      game_redo_temp: game_redo,
      inf_redo_temp: inf_redo,
    })
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleConfirm = () => {
    const { dispatch } = this.props
    const { game_mode_temp, game_round_temp, game_redo_temp, inf_redo_temp } = this.state
    dispatch(changeGameMode(game_mode_temp))
    dispatch(changeGameRound(game_round_temp))
    dispatch(changeGameRedo(game_redo_temp))
    dispatch(changeInfRedo(inf_redo_temp))
    this.setState({open: false});
  }

  handleNothing = (event) => {}

  handleRoundInc = (event) => {
    const { game_round_temp } = this.state
    this.setState({game_round_temp: game_round_temp + 1})
  }

  handleRoundDec = (event) => {
    const { game_round_temp } = this.state
    this.setState({game_round_temp: game_round_temp - 1})
  }

  handleRedoInc = (event) => {
    const { game_redo_temp } = this.state
    this.setState({game_redo_temp: game_redo_temp + 1})
  }

  handleRedoDec = (event) => {
    const { game_redo_temp } = this.state
    this.setState({game_redo_temp: game_redo_temp - 1})
  }
  handleGameMode = (event) => {
    const { game_mode_temp } = this.state
    this.setState({game_mode_temp: game_mode_temp == "ultimatum"? "dictator" : "ultimatum"})
  }

  render() {
    const { page, inf_redo, game_mode, game_round, game_redo } = this.props
    const { game_mode_temp, game_round_temp, game_redo_temp, inf_redo_temp } = this.state
    const actions = [
      <RaisedButton
        label="適用"
        primary={true}
        onTouchTap={this.handleConfirm}
      />,
      <RaisedButton
        label="キャンセル"
        onTouchTap={this.handleClose}
      />,
    ];

    return (
      <span style={{overflow: "hidden"}}>
        <FloatingActionButton
          onTouchTap={this.handleOpen}
          style={{marginRight: "12px"}}
          disabled={page != "waiting"}
        ><ActionSettings /></FloatingActionButton>
        <Dialog
          title="実験設定"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
          autoScrollBodyContent={true}
        >
          <Chip style={styles.chip}>ゲームモード: {getGamemodeName(game_mode)}</Chip>
          <Chip style={styles.chip}>ラウンド: {game_round}</Chip>
          <Chip style={styles.chip}>再提案可能回数: {inf_redo? "∞" :game_redo}</Chip>
          <p>ゲームのラウンド数: {game_round_temp}回 (役割交換回数: {game_round_temp-1}回)</p>
          { game_round_temp != 1?
            <RaisedButton
              label="-"
              style={styles.game_roundButton}
              onClick={this.handleRoundDec}
            />
            :
            <FlatButton
              label="-"
              style={styles.game_roundButton}
            />
          }
          <RaisedButton
            label="+"
            style={styles.game_roundButton}
            onClick={this.handleRoundInc}
          />
          <p>再提案回数: {inf_redo_temp? "∞" : game_redo_temp}回</p>
          <Toggle
            label="無制限"
            toggled={inf_redo_temp}
            style={{margin: 4, maxWidth: 200}}
            onToggle={this.handleToggle}
          />
          { game_redo_temp != 0?
            <RaisedButton
              label="-"
              style={styles.game_roundButton}
              onClick={this.handleRedoDec}
              disabled={inf_redo_temp}
            />
            :
            <FlatButton
              label="-"
              style={styles.game_roundButton}
              disabled={inf_redo_temp}
            />
          }
          <RaisedButton
            label="+"
            style={styles.game_roundButton}
            disabled={inf_redo_temp}
            onClick={this.handleRedoInc}
          />
          <p>ゲームモード: {getGamemodeName(game_mode_temp)}</p>
          <RaisedButton
            label="最後通牒ゲーム"
            style={styles.game_modeButton}
            onClick={game_mode_temp == "dictator"? this.handleGameMode : this.handleNothing}
            primary={game_mode_temp == "ultimatum"}
          />
          <RaisedButton
            label="独裁者ゲーム"
            style={styles.game_modeButton}
            onClick={game_mode_temp == "ultimatum"? this.handleGameMode : this.handleNothing}
            primary={game_mode_temp == "dictator"}
          />
        </Dialog>
      </span>
    );
  }
}

export default connect(mapStateToProps)(ExperimentSetting)
