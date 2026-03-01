# Product Requirement Document -- Version MVP_1 -- Draft

## What is the product

A non-monetary prediction market for Bangladesh. It will look like a traditional prediction market but the mechanism is different.

Instead of betting with money, users bet to be put in a lottery to win prizes.

The more people win the bet, the less chance they have of winning the prize, that is how the leverage mechanism works. You don't 5x your money, you 5x your chance of winnin if you bet on the losing prediction.

##  Features

* Markets with live updates (line charts),
* Leaderboard among friends, people can add friends via links or they get added through invite to open account directly
* Simple profile pages
* Every market/prediction should be sharable through meta's facebook messenger, instagram, whatsapp, telegram, or link.
* Coin system to limit how many bets users can make. Coins can't be bought yet, users get n coins each day, and will get n when a friend signs up using their link.
* Authentication via phone number OTP.


This is the core thesis for now.

## Tech Stack

Frontend: Next.js, Typescript, GSAP

Backend: python FastAPI

database: Supabase

Deployment: railway and vercel