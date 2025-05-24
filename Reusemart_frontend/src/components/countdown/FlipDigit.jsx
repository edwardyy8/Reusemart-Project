import { useEffect, useState, useRef } from 'react';
import './FlipDigit.css';

import { useNavigate } from 'react-router-dom';
import { WaktuHabis } from '../../api/apiPemesanan';
import { toast } from 'react-toastify';

const FlipUnit = ({ digit }) => {
  const [prevDigit, setPrevDigit] = useState(digit);
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (digit !== prevDigit) {
      setIsFlipping(true);
      const timeout = setTimeout(() => {
        setPrevDigit(digit);
        setIsFlipping(false);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [digit, prevDigit]);

  return (
    <div className="flip-unit">
      <div className="cardWaktu">
        <div className="upper-card text-white">{!isFlipping ? digit : prevDigit}</div>
        {/* <div className="lower-card text-white">{digit}</div> */}
        {isFlipping && <div className="flip-card top-flip">{prevDigit}</div>}
        {isFlipping && <div className="flip-card bottom-flip">{digit}</div>}
      </div>
      
    </div>
  );
};

const FlipCountdown = ({ targetTime, idPemesanan }) => {
    const navigate = useNavigate();
    
    const [isExpired, setIsExpired] = useState(false);
    const intervalRef = useRef(null);

    const handleWaktuHabis = async () => {
        try {
            const response = await WaktuHabis(idPemesanan);
            toast.warning("Waktu telah habis, pemesanan dibatalkan");
            navigate("/pembeli/profile");
            return;
        } catch (err) {
            toast.error("Gagal update: " + (err.message || "Terjadi kesalahan"));
            console.log("Error detail:", err);
        }
    }

    const calculateTimeLeft = (targetTime) => {
        const difference = new Date(targetTime).getTime() - new Date().getTime();

        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        return { minutes, seconds };
    };

    const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetTime));

    useEffect(() => {
        intervalRef.current = setInterval(() => {
            const newTime = calculateTimeLeft(targetTime);
            setTimeLeft(newTime);

            if (newTime.minutes === 0 && newTime.seconds === 0) {
                clearInterval(intervalRef.current);
                if (!isExpired) {
                    setIsExpired(true);
                    handleWaktuHabis();
                }
            }
        }, 1000);

        return () => {
            clearInterval(intervalRef.current); 
        };
        
    }, [targetTime, isExpired]);

    const formatDigit = (value) => value.toString().padStart(2, '0').split('');
    const [minTens, minOnes] = formatDigit(timeLeft.minutes);
    const [secTens, secOnes] = formatDigit(timeLeft.seconds);

    return (
        <div>
            <div className="countdown-container">
                <FlipUnit digit={minTens} />
                <FlipUnit digit={minOnes} />
                <div className="colon text-black">:</div>
                <FlipUnit digit={secTens} />
                <FlipUnit digit={secOnes} />
            </div>
            <div className="d-flex flex-row justify-content-between align-items-center">
                <p className='h6 ms-auto me-5 text-muted'>Menit</p>
                <p className='h6 me-auto ms-5 text-muted'>Detik</p>
            </div>
        </div>
    );
};


export default FlipCountdown;
