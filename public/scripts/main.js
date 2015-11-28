// source of data
	// let data = [{
	// 	id: 1,
	// 	author: "Khalid Ali",
	// 	text: "This is one comment"
	// }, {
	// 	id: 2,
	// 	author: "John Mannah",
	// 	text: "This is *another* comment"
	// }];

let CommentBox = React.createClass({
	loadCommentsFromServer() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({
					data: data
				})
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	// excutes once 
	getInitialState: function() {
		return {data: []};
	},
	componentDidMount() {
	    this.loadCommentsFromServer();
	    setInterval(this.loadCommentsFromServer, this.props.pollInterval);	
	},
	render() {
		return (
			<div className = "commentBox">
			    <h1> Comments </h1>  
			    <CommentList data={this.state.data} />
			    <CommentForm />
			</div>
		);
	}
});

let CommentList = React.createClass({
	// render comments dynamically
	render() {
		// map over data
		let commentNodes = this.props.data.map(comment => {
			return (
				<Comment author={comment.author} key={comment.id}>
				    {comment.text} 
				</Comment>
			);
		});
		return(
			<div className="commentList">
			    {commentNodes} 
			</div>
		);
	}
});

let CommentForm = React.createClass({
	getInitialState: function() {
		
	},
});

let Comment = React.createClass({
	rawMarkUp() {
		var rawMarkUp = marked(this.props.children.toString(), { sanitize: true });
		return { __html: rawMarkUp };
	},

	render() {
		return (
			<div className = "comment" >
			    <h2 className="commentAuthor"> 
			        {this.props.author}
			    </h2> 
			        <span dangerouslySetInnerHTML= {this.rawMarkUp()} />  
			</div>
		);
	}
});

ReactDOM.render(
	<CommentBox url="/api/comments" pollInterval={2000} />,
	document.getElementById('container')
);











