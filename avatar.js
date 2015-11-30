let Avatar = React.createClass({
	render() {
		return (
			<div>
			<ProfilePic username={this.props.username} />
			<ProfileLink username={this.props.username} /> 
			</div>
			);
	}
});

let ProfilePic = React.createClass({
	render() {
		return (
			<img src= {'https://graph.facebook.com/' + this.props.username + '/picture'} />

		);
	}
});

let profileNick = React.createClass({
	render() {
		return (
			<a href={'https://www.facebook.com' + this.props.username} >
			    {this.props.username} 
			</a>
		);
	}
});

ReactDOM.render(
	<Avator username='pwh' />,
	document.getElementById('example')
	);