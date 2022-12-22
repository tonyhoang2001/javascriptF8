
function Header() {
    return (
        <div className="header">New Header</div>
    )
}

class Content extends React.Component {
    render() {
        return (
            <div className="content">New Content</div>
        )
    }
}

console.log({Content});

const ul = (
    <div className="wrapper">
        <Header></Header>
        <Content></Content>
    </div>
)

console.log(<Header title2="abc"/>);
ReactDOM.render(ul, document.getElementById('root'));
