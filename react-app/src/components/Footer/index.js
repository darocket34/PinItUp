import "./Footer.css"

function Footer({isLoaded}){
    return (
        <>
            {isLoaded && <footer id="footer">
                <div class="footer master">
                    <h2 style={{textAlign: "center"}}>Contact</h2>
                    <div class="footer container">
                        <p><i class="fas fa-envelope"></i> BrooksD@alumni.stanford.edu</p>
                        <a href="https://github.com/darocket34" target="_blank" id="linkscontainer" className="button fit primary">
                            <i class="fa-brands fa-github fa-xl linksli"></i>
                        </a>
                        <a href="https://www.linkedin.com/in/darian-brooks92/" id="linkscontainer" target="_blank" className="button fit primary">
                            <i className="fa-brands fa-linkedin-in fa-xl"></i>
                        </a>
                    </div>
                </div>
		    </footer>}
        </>
    )
}

export default Footer;
