import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
        const data = await response.json();
        setRepositories(Array.isArray(data.repositories) ? data.repositories : []);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
        setRepositories([]);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
        setSuggestedRepositories([]);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    const safeRepositories = Array.isArray(repositories) ? repositories : [];

    if (searchQuery.trim() === "") {
      setSearchResults(safeRepositories);
      return;
    }

    const filteredRepo = safeRepositories.filter((repo) =>
      repo && repo.name && repo.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filteredRepo);
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <section id="dashboard">
        <aside>
          <h3>Suggested Repositories</h3>
          {suggestedRepositories.length === 0 ? (
            <p>No suggested repositories right now.</p>
          ) : (
            suggestedRepositories.map((repo) => (
              <Link key={repo._id} to={`/repo/${repo._id}`} style={{ display: "block", marginBottom: "0.5rem" }}>
                <div>
                  <h4>{repo.name}</h4>
                  <p>{repo.description || "No description provided."}</p>
                </div>
              </Link>
            ))
          )}
        </aside>
        <main>
          <h2>Your Repositories</h2>
          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchResults.length === 0 ? (
            <p>No repositories found.</p>
          ) : (
            searchResults.map((repo) => (
              <Link key={repo._id} to={`/repo/${repo._id}`} style={{ display: "block", marginBottom: "0.75rem" }}>
                <div>
                  <h4>{repo.name}</h4>
                  <p>{repo.description || "No description provided."}</p>
                </div>
              </Link>
            ))
          )}
        </main>
        <aside>
          <h3>Upcoming Events</h3>
          <ul>
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  );
};

export default Dashboard;
