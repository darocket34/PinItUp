import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPins } from "../../store/pins";
import { getAllBoards } from "../../store/boards";
import PinCard from "../Pins/PinCard";
import Pagination from "./Pagination";
import loadingImage from "../../images/loading.gif"
import "./Homepage.css";

export default function HomePage() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    const pinsObj = useSelector((state) => state.pins.allPins);
    const user = useSelector((state) => state.session.user);
    const boards = useSelector((state) => state.boards.allBoards);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadDelay, setLoadDelay] = useState(false)
    const itemsPerPage = 20;

    const handleReturnToTop = () => {
        // e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        dispatch(getAllPins());
        if (user?.id) {
            dispatch(getAllBoards(user?.username));
        }
        setIsLoaded(true);
    }, [dispatch, user]);

    useEffect(() => {
        setLoadDelay(false)
        setTimeout(() => setLoadDelay(true),3500)
    }, [currentPage])

    const totalPages = Math.ceil(Object.keys(pinsObj).length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pinsToDisplay = Object.values(pinsObj).slice(startIndex, endIndex);

    return (
        <>
            {!loadDelay && (
                <div className="splash loading container">
                    <img src={loadingImage} alt="Loading" className="splash loading" />
                </div>
            )}
            {isLoaded && (
                <>
                <div className="homepage pin master container">
                    <button
                        className="homepage return to top"
                        onClick={handleReturnToTop}
                    >
                        <i className="fa-solid fa-circle-up fa-xl"></i>
                    </button>
                    {pinsToDisplay.map((pin, idx) => {
                    return (
                        <div key={idx} className="homepage single pin container">
                            <PinCard key={idx} pin={pin} boardsObj={boards} user={user} />
                        </div>
                    );
                    })}
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    onReturnToTop={handleReturnToTop}
                />
                </>
            )}
        </>
    );
}
