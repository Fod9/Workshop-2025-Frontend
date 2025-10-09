import "../../styles/components/header.css"

interface HeaderProps {
  title: string;
  secondTitle: string;
}

export default function Header({title, secondTitle}: HeaderProps) {
    return (
        <div className="header-container">
            <div className="left-part">
                <img src="/assets/logo-light.svg" className="logo" alt="Logo" />
                <p className="header-title">{title}</p>
            </div>
            <p className="header-second-title">{secondTitle}</p>
        </div>
    );
}