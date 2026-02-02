const PDFDocument = require('pdfkit');
const Certificate = require('../models/Certificate');
const Score = require('../models/Score');
const User = require('../models/User');
const Quiz = require('../models/Quiz');

/**
 * Check if user is eligible for certificate
 * @route GET /api/certificates/check/:scoreId
 * @access Private
 */
const checkEligibility = async (req, res) => {
    try {
        const { scoreId } = req.params;

        const score = await Score.findById(scoreId)
            .populate('quiz', 'title passingScore');

        if (!score) {
            return res.status(404).json({
                success: false,
                message: 'Score not found'
            });
        }

        // Check if user owns this score
        if (score.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        // Check if already has certificate
        const existingCert = await Certificate.findOne({
            user: req.user._id,
            score: scoreId
        });

        if (existingCert) {
            return res.json({
                success: true,
                eligible: true,
                alreadyExists: true,
                certificateId: existingCert.certificateId
            });
        }

        // Check if passed
        const eligible = score.passed;

        res.json({
            success: true,
            eligible,
            alreadyExists: false,
            scorePercentage: score.percentage,
            passingScore: score.quiz.passingScore
        });
    } catch (error) {
        console.error('Check eligibility error:', error);
        res.status(500).json({
            success: false,
            message: 'Error checking eligibility',
            error: error.message
        });
    }
};

/**
 * Generate certificate
 * @route POST /api/certificates/generate
 * @access Private
 */
const generateCertificate = async (req, res) => {
    try {
        const { scoreId } = req.body;

        const score = await Score.findById(scoreId)
            .populate('quiz', 'title category');

        if (!score) {
            return res.status(404).json({
                success: false,
                message: 'Score not found'
            });
        }

        // Check if user owns this score
        if (score.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized access'
            });
        }

        // Check if passed
        if (!score.passed) {
            return res.status(400).json({
                success: false,
                message: 'Certificate can only be generated for passed quizzes'
            });
        }

        // Check if certificate already exists
        let certificate = await Certificate.findOne({
            user: req.user._id,
            score: scoreId
        });

        if (!certificate) {
            // Create new certificate
            certificate = await Certificate.create({
                user: req.user._id,
                quiz: score.quiz._id,
                score: scoreId,
                scoreAchieved: score.percentage
            });
        }

        const user = await User.findById(req.user._id);

        // Generate PDF
        const doc = new PDFDocument({
            layout: 'landscape',
            size: 'A4'
        });

        // Set response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=certificate-${certificate.certificateId}.pdf`
        );

        // Pipe PDF to response
        doc.pipe(res);

        // Certificate design
        // Border
        doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
            .lineWidth(2)
            .stroke('#1a73e8');

        // Title
        doc.fontSize(40)
            .fillColor('#1a73e8')
            .text('Certificate of Achievement', 0, 100, {
                align: 'center'
            });

        // Subtitle
        doc.fontSize(16)
            .fillColor('#666')
            .text('This is to certify that', 0, 170, {
                align: 'center'
            });

        // User name
        doc.fontSize(32)
            .fillColor('#000')
            .text(user.username, 0, 210, {
                align: 'center'
            });

        // Achievement text
        doc.fontSize(16)
            .fillColor('#666')
            .text('has successfully completed', 0, 270, {
                align: 'center'
            });

        // Quiz title
        doc.fontSize(24)
            .fillColor('#1a73e8')
            .text(score.quiz.title, 0, 310, {
                align: 'center'
            });

        // Score
        doc.fontSize(16)
            .fillColor('#666')
            .text(`with a score of ${score.percentage}%`, 0, 360, {
                align: 'center'
            });

        // Date
        const issueDate = new Date(certificate.issueDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        doc.fontSize(14)
            .fillColor('#999')
            .text(`Issued on ${issueDate}`, 0, 420, {
                align: 'center'
            });

        // Certificate ID
        doc.fontSize(10)
            .fillColor('#999')
            .text(`Certificate ID: ${certificate.certificateId}`, 0, 460, {
                align: 'center'
            });

        // Platform name
        doc.fontSize(12)
            .fillColor('#1a73e8')
            .text('Logical Thinking Learning Platform', 0, doc.page.height - 80, {
                align: 'center'
            });

        // Finalize PDF
        doc.end();

    } catch (error) {
        console.error('Generate certificate error:', error);
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                message: 'Error generating certificate',
                error: error.message
            });
        }
    }
};

/**
 * Get user's certificates
 * @route GET /api/certificates/user
 * @access Private
 */
const getUserCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find({ user: req.user._id })
            .populate('quiz', 'title category')
            .populate('score', 'percentage completedAt')
            .sort({ issueDate: -1 });

        res.json({
            success: true,
            count: certificates.length,
            data: certificates
        });
    } catch (error) {
        console.error('Get certificates error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching certificates',
            error: error.message
        });
    }
};

module.exports = {
    checkEligibility,
    generateCertificate,
    getUserCertificates
};
