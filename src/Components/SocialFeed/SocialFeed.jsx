import { useState, useEffect, useContext } from "react";
import "./SocialFeed.css";
import { UserContext } from "../../contexts/userContext";
import { fetchPublicDreams, toggleDreamLike, addComment } from "../../utils/socialFeedApi";

function SocialFeed() {
  const [publicDreams, setPublicDreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [showCommentInput, setShowCommentInput] = useState({});
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    loadPublicDreams();

    const interval = setInterval(loadPublicDreams, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadPublicDreams = async () => {
    try {
      const dreams = await fetchPublicDreams();
      setPublicDreams(dreams);
    } catch (error) {
      console.error("Failed to load public dreams:", error);
      // Show empty state if API fails
      setPublicDreams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (dreamId) => {
    if (!currentUser) return;

    try {
      // Call API to toggle like on the backend
      await toggleDreamLike(dreamId);
      
      // Update local state optimistically
      setPublicDreams((prev) =>
        prev.map((dream) => {
          if (dream._id === dreamId) {
            const isLiked = dream.likes.includes(currentUser._id);
            const newLikes = isLiked
              ? dream.likes.filter((id) => id !== currentUser._id)
              : [...dream.likes, currentUser._id];
            return { ...dream, likes: newLikes };
          }
          return dream;
        })
      );
    } catch (error) {
      console.error("Failed to toggle like:", error);
      alert("Failed to like dream. Please try again.");
    }
  };

  const handleComment = async (dreamId, commentTextValue) => {
    if (!currentUser || !commentTextValue.trim()) return;

    try {
      // Call API to add comment on the backend
      await addComment(dreamId, commentTextValue);
      
      // Clear the comment input
      setCommentText(prev => ({ ...prev, [dreamId]: '' }));
      setShowCommentInput(prev => ({ ...prev, [dreamId]: false }));
      
      // Refresh the dreams to get the updated comment with populated user data
      await loadPublicDreams();
    } catch (error) {
      console.error("Failed to add comment:", error);
      alert("Failed to add comment. Please try again.");
    }
  };

  const toggleCommentInput = (dreamId) => {
    setShowCommentInput(prev => ({ ...prev, [dreamId]: !prev[dreamId] }));
  };

  const handleCommentChange = (dreamId, value) => {
    setCommentText(prev => ({ ...prev, [dreamId]: value }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="social-feed__loading">Loading dreams...</div>;
  }

  return (
    <div className="social-feed">
      <div className="social-feed__header">
        <h2>Collective Dreams</h2>
        <button
          className="social-feed__refresh"
          onClick={loadPublicDreams}
          disabled={loading}
        >
          {loading ? "🔄" : "↻"}
        </button>
      </div>

      <div className="social-feed__posts">
        {publicDreams.length === 0 ? (
          <div className="social-feed__empty">
            <p>No dreams shared yet. Be the first to share your dream!</p>
          </div>
        ) : (
          publicDreams.map((dream) => (
            <div key={dream._id} className="social-feed__post">
              <div className="social-feed__post-header">
                <div className="social-feed__user">
                  <div className="social-feed__avatar">
                    {dream.user.avatar ? (
                      <img src={dream.user.avatar} alt={dream.user.username} />
                    ) : (
                      <div className="social-feed__avatar-placeholder">
                        {dream.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="social-feed__user-info">
                    <h4>{dream.user.username}</h4>
                    <span className="social-feed__date">
                      {formatDate(dream.date)}
                    </span>
                  </div>
                </div>
                <div className="social-feed__moon-sign">
                  🌙 {dream.moonSign}
                </div>
              </div>

              <div className="social-feed__content">
                <p className="social-feed__summary">{dream.summary}</p>

                {dream.categories && (
                  <div className="social-feed__categories">
                    {(Array.isArray(dream.categories)
                      ? dream.categories
                      : dream.categories.split(",")
                    ).map((category, index) => (
                      <span key={index} className="social-feed__category">
                        {category.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {dream.tags && (
                  <div className="social-feed__tags">
                    {(Array.isArray(dream.tags)
                      ? dream.tags
                      : dream.tags.split(",")
                    ).map((tag, index) => (
                      <span key={index} className="social-feed__tag">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="social-feed__actions">
                <button
                  className={`social-feed__like-btn ${
                    currentUser && dream.likes.includes(currentUser._id)
                      ? "liked"
                      : ""
                  }`}
                  onClick={() => handleLike(dream._id)}
                  disabled={!currentUser}
                >
                  <span className="like-icon">❤️</span>
                  <span>{dream.likes.length}</span>
                </button>

                <button 
                  className="social-feed__comment-btn"
                  onClick={() => toggleCommentInput(dream._id)}
                  disabled={!currentUser}
                >
                  <span className="comment-icon">💬</span>
                  <span>{dream.comments.length}</span>
                </button>
              </div>

              {/* Comment input */}
              {showCommentInput[dream._id] && currentUser && (
                <div className="social-feed__comment-input">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[dream._id] || ''}
                    onChange={(e) => handleCommentChange(dream._id, e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleComment(dream._id, commentText[dream._id]);
                      }
                    }}
                    className="social-feed__comment-input-field"
                  />
                  <button
                    onClick={() => handleComment(dream._id, commentText[dream._id])}
                    className="social-feed__comment-submit"
                    disabled={!commentText[dream._id]?.trim()}
                  >
                    Post
                  </button>
                </div>
              )}

              {dream.comments.length > 0 && (
                <div className="social-feed__comments">
                  {dream.comments
                    .slice()
                    .reverse()
                    .map((comment) => (
                    <div key={comment._id} className="social-feed__comment">
                      <div className="social-feed__comment-avatar">
                        {comment.user.avatar ? (
                          <img
                            src={comment.user.avatar}
                            alt={comment.user.username}
                          />
                        ) : (
                          <div className="social-feed__comment-avatar-placeholder">
                            {comment.user.username.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div className="social-feed__comment-content">
                        <span className="social-feed__comment-username">
                          {comment.user.username}
                        </span>
                        <p className="social-feed__comment-text">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SocialFeed;
