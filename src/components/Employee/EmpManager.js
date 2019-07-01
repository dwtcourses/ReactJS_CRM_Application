import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// Icons
import BankIcon from '@material-ui/icons/Payment';
import AddOffersIcon from '@material-ui/icons/CardGiftcard';
import SaveIcon from '@material-ui/icons/Save';

import Table from './EmpTable';
import axios from 'axios';
import Alert from '../Common/Alert';

//App Classes
import CardDiv from '../Common/CardDiv';
import AddEmployee from './AddEmp';

import { connect } from 'react-redux';
import { GetEmployees, RemoveEmp } from '../../store/actions/EmployeeActions';

function TabContainer(props) {
	return (
		<Typography component="div" style={{ padding: 8 * 3 }}>
			{props.children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired
};

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		width: '100%'
	},
	bar: {
		backgroundColor: '#1a237e'
	},
	rightIcon: {
		marginLeft: theme.spacing.unit
	},
	btnRightA: {
		position: 'absolute',
		top: theme.spacing.unit * 13,
		right: theme.spacing.unit * 10
	},
	btnRightB: {
		position: 'absolute',
		bottom: theme.spacing.unit * 12,
		left: theme.spacing.unit * 13
	}
});

class EmpManager extends Component {
	constructor(props) {
		super(props);
		this.state = {
			employees: [],
			id: '',
			value: 0,
			isAddNew: false,
			isEdit: false
		};
	}

	handleChange = (event, value) => {
		this.setState({ value });
	};

	componentWillMount() {
		this.fetchEmployee();
	}

	fetchEmployee = () => {
		this.props.GetEmployees('');
	};

	onTapSaveChanges = () => {
		this.setState({
			showAlert: true,
			msg: 'All changes will be update on Application API Instantly.',
			title: 'Changes Confirmation!'
		});
	};

	onTapRegister() {
		this.setState({ isAddNew: true });
	}

	onTapBack() {
		this.setState({ isAddNew: false, isEdit: false });
		this.fetchEmployee();
	}

	onEditPaymentMode(bank) {
		let index = this.state.banks.findIndex((x) => x.id === bank.id);
		let activeBanks = this.state.banks;
		activeBanks[index] = bank;
		this.setState({
			banks: activeBanks
		});
		// this.props.UpdateBank(bank);
	}

	onDeleteEmp(emp) {
		const { id } = emp;
		this.setState({
			id: id,
			showAlert: true,
			msg: 'Are you sure to delete the selected Employee?',
			title: 'Delete Confirmation!'
		});
	}

	onExecuteDeleteCommand() {
		const { id } = this.state;
		this.props.RemoveEmp({ id });
	}

	render() {

		const { classes,employees } = this.props;
		const { value, isAddNew, showAlert, title, msg } = this.state;

		if (isAddNew) {
			return (
				<CardDiv title={'Add Employee'}>
					<AddEmployee onTapBack={this.onTapBack.bind(this)} />
				</CardDiv>
			);
		} else {
			return (
				<div>
					<Alert
						open={showAlert}
						onCancel={this.onDismiss.bind(this)}
						onOkay={this.onOkay.bind(this)}
						title={title}
						msg={msg}
					/>

					<CardDiv title={'Employee'}>
						{value === 0 && (
							<div>
								<Button
									variant="extendedFab"
									color="secondary"
									className={classes.btnRightA}
									onClick={this.onTapRegister.bind(this)}
								>
									Add <BankIcon className={classes.rightIcon} />
								</Button>
								{employees !== undefined && (<Table
									onEditPaymentMode={this.onEditPaymentMode.bind(this)}
									onDeleteEmp={this.onDeleteEmp.bind(this)}
									data={employees}
								/>) }
								
							</div>
						)}
					</CardDiv>
				</div>
			);
		}
	}

	//ALERT
	onDismiss = () => {
		this.setState({ showAlert: false });
	};

	onOkay = () => {
		this.setState({ showAlert: false });
		this.onExecuteDeleteCommand();
	};
}

EmpManager.propTypes = {
	classes: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
	employees: state.employeeReducer.employees
});

export default connect(mapStateToProps, { GetEmployees, RemoveEmp })(withStyles(styles)(EmpManager));