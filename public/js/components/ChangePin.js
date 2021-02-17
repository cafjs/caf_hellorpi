'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');

class ChangePin extends React.Component {

    constructor(props) {
        super(props);
        this.doChangePin = this.doChangePin.bind(this);
        this.doDismissChangePin = this.doDismissChangePin.bind(this);
        this.handleChangePin = this.handleChangePin.bind(this);
        this.submit = this.submit.bind(this);
    }

    doChangePin(ev) {
        const newPin = parseInt(this.props.newPinNumber);
        if (!isNaN(newPin)) {
            AppActions.configPin(this.props.ctx, newPin);
            this.doDismissChangePin();
        } else {
            AppActions.setError(this.props.ctx, new Error('Invalid pin'));
        }
    }

    doDismissChangePin(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newPinNumber: '',
            isChangePin: false
        });
    }

    handleChangePin(ev) {
        AppActions.setLocalState(this.props.ctx, {
            newPinNumber: ev.target.value
        });
    }

    submit(ev) {
        if (ev.key === 'Enter') {
            ev.preventDefault();
            this.doChangePin(ev);
        }
    }

    render() {
        return cE(rB.Modal, {show: !!this.props.isChangePin,
                             onHide: this.doDismissChangePin,
                             animation: false},
                  cE(rB.Modal.Header, {
                      className : 'bg-warning text-warning',
                      closeButton: true},
                     cE(rB.Modal.Title, null, 'Change GPIO Pin')
                    ),
                  cE(rB.ModalBody, null,
                     cE(rB.Form, {horizontal: true},
                        cE(rB.FormGroup, {controlId: 'newChangePinId'},
                           cE(rB.Col, {sm:3, xs: 12},
                              cE(rB.ControlLabel, null, 'Pin')
                             ),
                           cE(rB.Col, {sm:6, xs: 12},
                              cE(rB.FormControl, {
                                  type: 'text',
                                  value: this.props.newPinNumber,
                                  placeholder: '',
                                  onChange: this.handleChangePin,
                                  onKeyPress: this.submit
                              })
                             )
                          ),
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.ButtonGroup, null,
                        cE(rB.Button, {onClick: this.doDismissChangePin},
                           'Continue'),
                        cE(rB.Button, {onClick: this.doChangePin,
                                       bsStyle: 'danger'}, 'Update')
                       )
                    )
                 );
    }
};

module.exports = ChangePin;
