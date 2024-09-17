import React, { useEffect, useState } from "react";
import app from "../fireBaseConfig";
import { getDatabase, ref, get } from "firebase/database";

function Read() {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        const db = getDatabase(app);
        const dbRef = ref(db, 'esp32-0DA710');
        
        try {
            const snapshot = await get(dbRef);
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Fetched data:", data); // Log fetched data
                // Extract slot values from the object
                const slotsData = [
                    data.ir_sen1,
                    data.ir_sen2,
                    data.ir_sen3,
                    data.ir_sen4
                ];
                setSlots(slotsData);
            } else {
                setError("No data available");
            }
        } catch (err) {
            console.error("Firebase fetch error:", err);
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(() => {
            fetchData(); // Fetch data every 10 seconds
        }, 5000); // 10000 milliseconds = 10 seconds

        return () => {
            clearInterval(intervalId); // Cleanup interval on component unmount
        };
    }, []); // Fetch data only once when the component mounts

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div>
            <p>Parking Slot Status:</p>
            <ul style={{ listStyleType: 'none', padding: 0 }}>
                {slots.length === 0 ? (
                    <li>No parking slot data available</li>
                ) : (
                    slots.map((status, index) => (
                        <li
                            key={index}
                            style={{
                                width: '100px',
                                height: '100px',
                                margin: '10px',
                                display: 'inline-block',
                                backgroundColor: status === 1 ? 'green' : 'red',
                                color: 'white',
                                textAlign: 'center',
                                lineHeight: '100px',
                                fontWeight: 'bold'
                            }}
                        >
                            Slot {index + 1}
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
}

export default Read;
