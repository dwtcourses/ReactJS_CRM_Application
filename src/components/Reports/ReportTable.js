import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import moment from 'moment';
import Avatar from '@material-ui/core/Avatar';
import tiny from '@material-ui/core/colors/green';
import little from '@material-ui/core/colors/deepOrange';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Chip from '@material-ui/core/Chip';


//Icons
import CopyIcon from '@material-ui/icons/ContentCopy';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

function getSorting(order, orderBy) {
	return order === 'desc'
		? (a, b) => (b[orderBy] < a[orderBy] ? -1 : 1)
		: (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}


const columnData = [
	{ id: 'title', numeric: false, disablePadding: true, label: 'Report Title' },
	{ id: 'date', numeric: false, disablePadding: true, label: 'Date' },
	{ id: 'emp_name', numeric: false, disablePadding: true, label: 'Employee Name' },
	{ id: 'client_name', numeric: false, disablePadding: true, label: 'Client Name'},
	{ id: 'region', numeric: false, disablePadding: true, label: 'Task Region' },
	{ id: 'priority', numeric: false, disablePadding: true, label: 'Task Priority' },
	{ id: 'status', numeric: false, disablePadding: true, label: 'Task Status' },
	{ id: 'more', numeric: false, disablePadding: true, label: 'Action' }
];

class ReportTableHeader extends React.Component {
	createSortHandler = (property) => (event) => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { order, orderBy } = this.props;

		return (
			<TableHead>
				<TableRow>
					{columnData.map((column) => {
						return (
							<TableCell
								key={column.id}
								numeric={column.numeric}
								padding={column.disablePadding ? 'none' : 'default'}
								sortDirection={orderBy === column.id ? order : false}
							>
								<Tooltip
									title="Sort"
									placement={column.numeric ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										active={orderBy === column.id}
										direction={order}
										onClick={this.createSortHandler(column.id)}
									>
										{column.label}
									</TableSortLabel>
								</Tooltip>
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
		);
	}
}

ReportTableHeader.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const toolbarStyles = (theme) => ({
	root: {
		paddingRight: theme.spacing.unit
	},
	highlight:
		theme.palette.type === 'light'
			? {
					color: theme.palette.secondary.main,
					backgroundColor: lighten(theme.palette.secondary.light, 0.85)
				}
			: {
					color: theme.palette.text.primary,
					backgroundColor: theme.palette.secondary.dark
				},
	spacer: {
		flex: '1 1 100%'
	},
	actions: {
		color: theme.palette.text.secondary
	},
	title: {
		flex: '0 0 auto'
	}
});

let EnhancedTableToolbar = (props) => {
	const { numSelected, classes } = props;

	return (
		<Toolbar
			className={classNames(classes.root, {
				[classes.highlight]: numSelected > 0
			})}
		>
			<div className={classes.title}>
				{numSelected > 0 ? (
					<Typography color="inherit" variant="subheading">
						{numSelected} selected
					</Typography>
				) : (
					<Typography variant="title" id="tableTitle" />
				)}
			</div>
			<div className={classes.spacer} />
			<div className={classes.actions}>
				{numSelected > 0 ? (
					<Tooltip title="Delete">
						<IconButton aria-label="Delete">
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				) : (
					<Tooltip title="Filter list">
						<IconButton aria-label="Filter list">
							<FilterListIcon />
						</IconButton>
					</Tooltip>
				)}
			</div>
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = (theme) => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 2,
		boxShadow: 'none'
	},
	cat: {
		display: 'flex',
		flexDirection: 'row'
	},
	button: {
		width: 40,
		height: 40
	},
	activeUser: {
		margin: 2,
		width: 16,
		height: 16,
		fontSize: 10,
		color: '#fff',
		backgroundColor: tiny[500]
	},
	pendingUser: {
		margin: 2,
		width: 16,
		height: 16,
		fontSize: 10,
		color: '#fff',
		backgroundColor: '#FF0000'
	},
	disableUser: {
		margin: 2,
		width: 16,
		height: 16,
		fontSize: 10,
		color: '#fff',
		backgroundColor: little[500]
	},

	table: {
		minWidth: 1020,
		elevation: 0
	},
	tableWrapper: {
		overflowX: 'auto'
	}
});

class ReportTable extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			order: 'desc',
			orderBy: 'ecb_id',
			selected: [],
			data: props.data,
			page: 0,
			rowsPerPage: 5
		};
	}

	handleRequestSort = (event, property) => {
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}

		this.setState({ order, orderBy });
	};

	onCloneClick = (offer) => {
		this.props.onCloneClick(offer);
	};

	handleDelete = (offer) => {
		this.props.onDeleteOffer(offer);
	};

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({ rowsPerPage: event.target.value });
	};

	//Change Flags
	handleDOB = (field) => (event) => {
		field.date_of_birth = field.date_of_birth !== 0 ? 0 : 1;
		this.props.onEditFields(field);
	};

	handlePassportNumber = (field) => (event) => {
		field.passport_number = field.passport_number !== 0 ? 0 : 1;
		this.props.onEditFields(field);
	};

	handlePlaceOfIssue = (field) => (event) => {
		field.place_of_issue = field.place_of_issue !== 0 ? 0 : 1;
		this.props.onEditFields(field);
	};

	handleNationality = (field) => (event) => {
		field.nationality = field.nationality !== 0 ? 0 : 1;
		this.props.onEditFields(field);
	};

	handleVisaType = (field) => (event) => {
		field.visa_type = field.visa_type !== 0 ? 0 : 1;
		this.props.onEditFields(field);
	};

	handleExpDate = (field) => (event) => {
		field.exp_date = field.exp_date !== 0 ? 0 : 1;
		this.props.onEditFields(field);
	};

	activeCheck = (value) => {
		const { classes } = this.props;
		if (value === 'YES') {
			return <Avatar className={classes.activeUser}>A</Avatar>;
		} else {
			return <Avatar className={classes.pendingUser}>P</Avatar>;
		}
	};

	isSelected = (id) => this.state.selected.indexOf(id) !== -1;

	render() {
		const { classes } = this.props;
		const { order, orderBy, selected, rowsPerPage, page } = this.state;

		const { data, isEdit } = this.props;

		const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

		return (
			<Paper className={classes.root}>
				<EnhancedTableToolbar numSelected={selected.length} />
				<div className={classes.tableWrapper}>
					<Table className={classes.table} aria-labelledby="tableTitle">
						<ReportTableHeader
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={data.length}
						/>
 
						<TableBody>
							{data
								.sort(getSorting(order, orderBy))
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((n) => {
									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={n.id}>
											<TableCell>{n.title}</TableCell>
											<TableCell>{moment(n.date).format('Do MMM YYYY') }</TableCell>
											<TableCell>{n.emp_name}</TableCell>
											<TableCell>{n.client_name}</TableCell>
											<TableCell>{n.region}</TableCell>
											<TableCell>
												{n.priority == 2 && <Chip label="Urgent" className={classes.chip}  color="secondary" /> }
												{n.priority == 1 && <Chip label="High" className={classes.chip} color="default" /> }
												{n.priority == 0 && <Chip label="Normal" className={classes.chip} color="primary" /> }
											</TableCell>
											<TableCell>
												{n.status == 2 && <Chip label="Completed" className={classes.chip}  color="secondary" /> }
												{n.status == 1 && <Chip label="On Progress" className={classes.chip} color="default" /> }
												{n.status == 0 && <Chip label="Pending" className={classes.chip} color="primary" /> }
											</TableCell>
											<TableCell>
												<IconButton
													className={classes.button}
													mini
													aria-label="Edit"
													onClick={(event) => this.handleDelete(n)}
												>
													<DeleteIcon />
												</IconButton>
											</TableCell>
										</TableRow>
									);
								})}
							{emptyRows > 0 && (
								<TableRow style={{ height: 49 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<TablePagination
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					backIconButtonProps={{
						'aria-label': 'Previous Page'
					}}
					nextIconButtonProps={{
						'aria-label': 'Next Page'
					}}
					onChangePage={this.handleChangePage}
					onChangeRowsPerPage={this.handleChangeRowsPerPage}
				/>
			</Paper>
		);
	}
}

ReportTable.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ReportTable);