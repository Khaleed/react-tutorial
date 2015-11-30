let CommentBox = React.createClass({
	loadCommentsFromServer() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data})
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	handleCommentSubmit(comment) {
		var comments = this.state.data;
		comment.id = Date.now();
		var newComments = comments.concat([comment]);
		this.setState({data: newComments});
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: comment,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	// excutes once 
	getInitialState() {
		return {data: []};
	},
	componentDidMount() {
	    this.loadCommentsFromServer();
	    setInterval(this.loadCommentsFromServer, this.props.pollInterval);	
	},
	render() {
		return (
			<div className = 'commentBox'>
			    <h1> Comments </h1>  
			    <CommentList data={this.state.data} />
			    <CommentForm onCommentSubmit={this.handleCommentSubmit} />
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
		return (
			<div className='commentList'>
			    {commentNodes} 
			</div>
		);
	}
});
// ask user for name and comment
// and send request to server to save that comment
let CommentForm = React.createClass({
	getInitialState() {
		return {author: '', text: ''}
	},
	handleAuthorChange(e) {
		// this changes the private state of the component
		this.setState({author: e.target.value});
	},
	handleTextChange(e) {
		this.setState({text: e.target.value});
	},
	handleSubmit(e) {
		e.preventDefault();
		let author = this.state.author.trim();
		let text = this.state.text.trim();
		if (!author || !text) {
			return;
		}
		// send request to server
		this.props.onCommentSubmit({author: author, text: text});
		// change state back to default
		this.setState({author: '', text: ''});
	},
	render() {
		return (
			<form className='commentForm' onSubmit={this.handleSubmit}>
			    <input
			        type='text'
			        placeholder = 'Your name'
			        value= {this.state.author}
			        // attach event handler
			        onChange= {this.handleAuthorChange}
			   />
			   <input
			        type='author'
			        placeholder = 'Say something...'
			        value= {this.state.text}
			        onChange= {this.handleTextChange}
			   />
			   <input type='submit' value='Post'/>
			</form>
			);
	}
});

let Comment = React.createClass({
	rawMarkUp() {
		var rawMarkUp = marked(this.props.children.toString(), { sanitize: true });
		return { __html: rawMarkUp };
	},

	render() {
		return (
			<div className = 'comment' >
			    <h2 className='commentAuthor'> 
			        {this.props.author}
			    </h2> 
			        <span dangerouslySetInnerHTML= {this.rawMarkUp()} />  
			</div>
		);
	}
});

ReactDOM.render(
	// fetch data from server every 2 seconds
	// the component will re-render itself every time it gets new data
	<CommentBox url='/api/comments' pollInterval={2000} />,
	document.getElementById('container')
);








