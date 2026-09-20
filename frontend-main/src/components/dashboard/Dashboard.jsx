import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../Navbar";
import HeatMapProfile from "../user/HeatMap";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Badge from "../ui/Badge";
import "./dashboard.css";

const Dashboard = () => {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  
  const [userDetails, setUserDetails] = useState(null);
  
  const [isLoadingRepos, setIsLoadingRepos] = useState(true);
  const [isLoadingSuggested, setIsLoadingSuggested] = useState(true);
  
  const [repoError, setRepoError] = useState("");
  const [suggestedError, setSuggestedError] = useState("");

  const userId = localStorage.getItem("userId");

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await axios.get(`http://localhost:3000/userProfile/${userId}`);
      setUserDetails(response.data);
    } catch (err) {
      console.error("Cannot fetch user details: ", err);
    }
  }, [userId]);

  const fetchRepositories = useCallback(async () => {
    setIsLoadingRepos(true);
    setRepoError("");
    try {
      const response = await axios.get(`http://localhost:3000/repo/user/${userId}`);
      setRepositories(Array.isArray(response.data.repositories) ? response.data.repositories : []);
    } catch (err) {
      console.error("Error while fetching repositories: ", err);
      setRepoError("Unable to load repositories. Please check your connection and try again.");
    } finally {
      setIsLoadingRepos(false);
    }
  }, [userId]);

  const fetchSuggestedRepositories = useCallback(async () => {
    setIsLoadingSuggested(true);
    setSuggestedError("");
    try {
      const response = await axios.get(`http://localhost:3000/repo/all`);
      setSuggestedRepositories(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error while fetching suggested repositories: ", err);
      setSuggestedError("Unable to load repositories to explore.");
    } finally {
      setIsLoadingSuggested(false);
    }
  }, []);

  useEffect(() => {
    fetchUserDetails();
    fetchRepositories();
    fetchSuggestedRepositories();
  }, [fetchUserDetails, fetchRepositories, fetchSuggestedRepositories]);

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

  // Derived initials
  const initials = userDetails?.username 
    ? userDetails.username.substring(0, 2).toUpperCase() 
    : "??";

  return (
    <div className="orbit-theme orbit-dashboard-page">
      <Navbar />
      
      <main className="orbit-dashboard-container">
        
        {/* HEADER */}
        <header className="orbit-dashboard-header">
          <div>
            <h1>Good morning, {userDetails?.username || "Developer"}</h1>
            <p className="orbit-text-muted">Here&apos;s what&apos;s happening across your workspace.</p>
          </div>
          <div>
            <Link to="/create">
              <Button>+ New Repository</Button>
            </Link>
          </div>
        </header>

        <div className="orbit-dashboard-grid">
          {/* MAIN WORKSPACE */}
          <div className="orbit-dashboard-main">
            
            {/* SEARCH */}
            <div className="orbit-search-container">
              <Input
                type="text"
                value={searchQuery}
                placeholder="Search repositories..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* YOUR REPOSITORIES */}
            <section className="orbit-dashboard-section">
              <h2>Your Repositories</h2>
              
              {isLoadingRepos ? (
                <div className="orbit-repo-grid">
                  <Card className="orbit-skeleton-card"><div className="skeleton-line" /><div className="skeleton-line short" /></Card>
                  <Card className="orbit-skeleton-card"><div className="skeleton-line" /><div className="skeleton-line short" /></Card>
                </div>
              ) : repoError ? (
                <Card className="orbit-error-state">
                  <p>{repoError}</p>
                  <Button variant="outline" onClick={fetchRepositories} style={{ marginTop: '12px' }}>Retry</Button>
                </Card>
              ) : searchResults.length === 0 ? (
                <Card className="orbit-empty-state">
                  <p>No repositories found.</p>
                  <Link to="/create">
                    <Button variant="primary" style={{ marginTop: '12px' }}>Create Repository</Button>
                  </Link>
                </Card>
              ) : (
                <div className="orbit-repo-grid">
                  {searchResults.map((repo) => (
                    <Link key={repo._id} to={`/repo/${repo._id}`} className="orbit-repo-card-link">
                      <Card className="orbit-repo-card">
                        <div className="orbit-repo-card-header">
                          <h4 className="orbit-repo-name">
                            <span className="orbit-repo-icon">◇</span> {repo.name}
                          </h4>
                          <Badge variant="neutral">Public</Badge>
                        </div>
                        <p className="orbit-repo-desc">{repo.description || "No description provided."}</p>
                        <div className="orbit-repo-meta">
                          {repo.language ? (
                            <span><span className="orbit-lang-dot"></span>{repo.language}</span>
                          ) : (
                            <span><span className="orbit-lang-dot"></span>JavaScript</span>
                          )}
                          <span className="orbit-repo-arrow">→</span>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* CONTRIBUTION ACTIVITY */}
            <section className="orbit-dashboard-section">
              <h2>Contribution Activity</h2>
              <Card className="orbit-activity-card">
                <HeatMapProfile />
              </Card>
            </section>

            {/* EXPLORE REPOSITORIES */}
            <section className="orbit-dashboard-section">
              <h2>Explore Repositories</h2>
              
              {isLoadingSuggested ? (
                <div className="orbit-repo-grid">
                  <Card className="orbit-skeleton-card"><div className="skeleton-line" /><div className="skeleton-line short" /></Card>
                </div>
              ) : suggestedError ? (
                <Card className="orbit-error-state">
                  <p>{suggestedError}</p>
                  <Button variant="outline" onClick={fetchSuggestedRepositories} style={{ marginTop: '12px' }}>Retry</Button>
                </Card>
              ) : suggestedRepositories.length === 0 ? (
                <Card className="orbit-empty-state">
                  <p>No repositories to explore yet.</p>
                </Card>
              ) : (
                <div className="orbit-repo-grid">
                  {suggestedRepositories.slice(0, 6).map((repo) => (
                    <Link key={repo._id} to={`/repo/${repo._id}`} className="orbit-repo-card-link">
                      <Card className="orbit-explore-card">
                        <div className="orbit-explore-card-header">
                          <h4 className="orbit-repo-name">{repo.name}</h4>
                          <Badge variant="neutral">Public</Badge>
                        </div>
                        <p className="orbit-repo-desc">{repo.description || "No description provided."}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR */}
          <aside className="orbit-dashboard-sidebar">
            {/* PROFILE IDENTITY */}
            <Card className="orbit-profile-identity">
              <div className="orbit-profile-avatar">{initials}</div>
              <div className="orbit-profile-info">
                <h4>{userDetails?.username || "Developer"}</h4>
                <p>@{userDetails?.username || "user"}</p>
              </div>
              <Link to="/profile" className="orbit-profile-link">View Profile →</Link>
            </Card>

            {/* QUICK ACTIONS */}
            <Card className="orbit-quick-actions">
              <h4>Quick Actions</h4>
              <ul>
                <li><Link to="/create"><span>+</span> New Repository</Link></li>
                <li><Link to="/profile"><span>⚙</span> Settings</Link></li>
              </ul>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
