# Contributing to D&D Character Portrait Assets

We love your input! We want to make contributing to D&D Character Portrait Assets as easy and transparent as possible, whether it's:

- Submitting new character portraits
- Reporting issues with existing portraits
- Proposing new features
- Improving documentation

## 🎨 Art Style Guidelines

### General Requirements
- Dimensions: 400x400 pixels
- Format: Animated GIF
- Frame Rate: 24fps
- Animation Length: 2-4 seconds
- Loop: Infinite
- File Size: < 2MB per animation

### Visual Style
- Dark neon fantasy theme
- Cyan/magenta gradient effects
- Glowing magical elements
- Dynamic lighting
- Smooth animations
- Professional fantasy art style

### Animation Guidelines
- Smooth transitions between frames
- No jarring or abrupt movements
- Consistent lighting and effects
- Clear silhouette and readability
- Appropriate character proportions
- Fantasy-appropriate clothing and equipment

## 📂 File Organization

### Class-Specific Portraits
When contributing class-specific portraits, use the following naming convention:
```
portraits/[class]/[type].gif

Examples:
portraits/warrior/base.gif
portraits/mage/action-1.gif
portraits/rogue/special.gif
```

### Rarity-Based Portraits
For rarity-based portraits:
```
portraits/[rarity]/[theme]-[number].gif

Examples:
portraits/common/adventurer-1.gif
portraits/legendary/hero-2.gif
```

## 🚀 Submission Process

1. **Fork the Repository**
   ```bash
   git clone https://github.com/tiation/dnd-assets.git
   cd dnd-assets
   ```

2. **Create a Branch**
   ```bash
   git checkout -b portrait/your-portrait-name
   ```

3. **Add Your Portraits**
   - Place files in appropriate directories
   - Ensure they meet style guidelines
   - Test animations in the sample app

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: [class] portrait - [description]"
   ```

5. **Push to Your Fork**
   ```bash
   git push origin portrait/your-portrait-name
   ```

6. **Submit a Pull Request**
   - Include preview images/GIFs
   - Describe the portraits added
   - Reference any related issues

## 🎮 Testing

Before submitting:
1. Test portraits in the sample app
2. Verify animation smoothness
3. Check file size optimization
4. Ensure style consistency
5. Validate directory structure

## 📝 Documentation

When adding new portraits, update:
1. Portrait catalog in README
2. Usage examples if needed
3. Style guidelines if expanded
4. Testing documentation if changed

## 🤝 Code of Conduct

### Our Standards
- Professional, welcoming environment
- Constructive feedback
- Focus on improvement
- Respect for all contributors

### Our Responsibilities
- Maintain quality standards
- Review submissions fairly
- Provide feedback promptly
- Support contributors

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.
