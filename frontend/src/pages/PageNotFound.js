import { Link } from "react-router-dom"

const PageNotFound = () => {
    return (
        <article style={{ padding: "100px" }}>
            <h1>Oops!</h1>
            <p>Page Not Found</p>
            <div className="flexGrow">
                <Link to="/">Back to Home</Link>
            </div>
        </article>
    )
}

export default PageNotFound