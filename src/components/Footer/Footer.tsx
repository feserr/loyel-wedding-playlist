import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
  return (
    <footer className="d-flex justify-content-between align-items-center py-3 border-top">
      <div className="p-1 col-md-4 d-flex align-items-center">
        <span className="has-vertically-align">{String.fromCharCode(169) + " 2023 Elías Serrano"}</span>
      </div>
      <div className="p-1 nav col-md-4 justify-content-end list-unstyled d-flex">
        <li className="ms-3">
          <a href="https://github.com/feserr/loyel-wedding-playlist"><FontAwesomeIcon icon={faGithub} /></a>
        </li>
      </div>
    </footer>
  )
}
