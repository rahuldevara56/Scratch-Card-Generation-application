import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import './Navbar.css';

const pages = [
  { display: 'users', path: '/users' },
  { display: 'generate scratchcards', path: '/generate-scratchcards' },
  { display: 'assign scratchcards', path: '/assign-scratchcards' },
  { display: 'transactions', path: '/transactions' }
];

function Navbar() {
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <EmojiEventsIcon sx={{ mr: 1, display: 'flex' }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SCRATCHCARD GENERATION APPLICATION
          </Typography>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
            {pages.map((page) => (
              <Button
                key={page.display}
                component={Link}
                to={page.path}
                sx={{ my: 2, color: 'white', display: 'block' }}
                onClick={undefined} // no-op placeholder; remove if not needed
              >
                {page.display}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
              