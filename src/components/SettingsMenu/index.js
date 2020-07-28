import React, { Component } from 'react'
import styles from "./SettingsMenu.css"; // eslint-disable-line
import PropTypes from 'prop-types'
import { Icon } from 'semantic-ui-react'

export default class Menu extends Component {
  componentDidMount () {
    // attach event listeners
    document.body.addEventListener('keydown', this.handleEscKey)
  }

  componentWillUnmount () {
    // remove event listeners
    document.body.removeEventListener('keydown', this.handleEscKey)
  }

  handleEscKey = e => {
    if (this.props.showMenu && e.which === 27) {
      this.props.handleModalClose()
    }
  };

  handleDelete = e => {
    e.preventDefault()
    const deleteConfirm = window.confirm(
      'Are you sure you want to clear all completed todos?'
    )
    if (deleteConfirm) {
      console.log('delete')
      this.props.handleClearCompleted()
    }
  };

  render () {
    const { showMenu } = this.props
    const showOrHide = showMenu ? 'flex' : 'none'
    const handlechangeSetting = () => {
      return this.changeSetting
    }
    return (
      <div className="settings-wrapper" style={{ display: showOrHide }}>
        <div className="settings-content">
          <span
            className="settings-close"
            onClick={this.props.handleModalClose}
            role="img"
            aria-label="close"
          >
            <Icon name="close" />
          </span>
          <h2>Settings</h2>
          <div className="settings-section" onClick={this.handleDelete}>
            <button className="btn-danger">Clear All Completed Todos</button>
          </div>
          <div className="settings-section" style={{ display: 'none' }}>
            <div className="settings-header">Sort Todos:</div>
            <div className="settings-options-wrapper" data-setting="sortOrder">
              <div
                className="settings-option"
                onClick={handlechangeSetting}
                data-value="desc"
              >
                Oldest First ▼
              </div>
              <div
                className="settings-option"
                onClick={handlechangeSetting}
                data-value="asc"
              >
                Most Recent First ▲
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Menu.propTypes = {
  showMenu: PropTypes.any,
  handleModalClose: PropTypes.any,
  handleClearCompleted: PropTypes.any
}
