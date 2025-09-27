const Admin = require('../modals/admin')
const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const generateAccessToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "15m" });

const generateRefreshToken = (id) =>
    jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, { expiresIn: "7d" });

const registerAdmin = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new Admin({
            name,
            email,
            password: hashedPassword,
            phone
        });

        await admin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const accessToken = generateAccessToken(admin._id);
        const refreshToken = generateRefreshToken(admin._id);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.json({
            accessToken,
            admin: { id: admin._id, name: admin.name, email: admin.email },
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const logoutAdmin = async (req, res) => {
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
    res.json({ message: "Logged out" });
}

const refreshAdmin = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        const accessToken = generateAccessToken(decoded.id);
        res.json({ accessToken });
    });
}

module.exports = { registerAdmin, loginAdmin, logoutAdmin, refreshAdmin }