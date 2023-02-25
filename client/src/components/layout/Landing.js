import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Landing = ({ isAuthenticated }) => {
  if (isAuthenticated) {
    return <Redirect to='/Dashboard'/>
  }
  
 return (
  <section className="landing">
  <div className="dark-overlay">
    <div className="landing-inner">
      <h1 className="x-large">FOOTGOLF FUN</h1>
      <h6>Make the world a little bit better place with footgolf social media.</h6>
      <p className="lead">
        Create a Footgolfer profile, post, like posts, comment and have fun with other footgolfers!
      </p>
      <div className="buttons">
        <Link to="/register" className="btn btn-primary">Sign Up </Link>
        <Link to="/login" className="btn btn-light">Login</Link> 
      </div>
    </div>
  </div>
</section>
  )
}

Landing.propTypes = {
  isAuthenticated: PropTypes.bool
}

const mapStateToProps = state => ({
 isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps)(Landing);