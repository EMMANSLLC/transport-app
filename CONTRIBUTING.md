# Contributing to Trucker Carriage Platform

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## 🌟 Ways to Contribute

- **Bug Reports**: Submit detailed bug reports with reproduction steps
- **Feature Requests**: Propose new features or improvements
- **Code Contributions**: Submit pull requests for bug fixes or features
- **Documentation**: Improve docs, add examples, fix typos
- **Testing**: Write tests, improve test coverage
- **Reviews**: Review pull requests from other contributors

## 🚀 Getting Started

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/trucker-carriage-platform.git
cd trucker-carriage-platform
```

### 2. Set Up Development Environment

```bash
# Install dependencies
npm install

# Set up environment variables
cd apps/backend
cp .env.example .env
# Edit .env with your local configuration

# Run database migrations
npm run migrate

# Start development servers
cd ../..
npm run dev
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

## 📝 Coding Standards

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow existing code style (ESLint configuration)
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Avoid `any` type when possible

### File Organization

```
src/
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API routes
├── middleware/      # Express middleware
├── models/          # Data models (if not using Prisma)
└── utils/           # Helper functions
```

### Naming Conventions

- **Files**: camelCase for files (`userController.ts`)
- **Classes**: PascalCase (`UserService`)
- **Functions**: camelCase (`getUserById`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_UPLOAD_SIZE`)
- **Interfaces**: PascalCase with I prefix optional (`User` or `IUser`)

### Code Style

```typescript
// Good
async function createTrip(data: CreateTripDto): Promise<Trip> {
  const trip = await prisma.trip.create({
    data: {
      ...data,
      status: TripStatus.PENDING,
    },
  });
  
  return trip;
}

// Bad
async function createTrip(data: any) {
  const trip = await prisma.trip.create({data: {...data, status: 'PENDING'}})
  return trip
}
```

## 🧪 Testing

### Writing Tests

```typescript
describe('TripController', () => {
  describe('createTrip', () => {
    it('should create a new trip', async () => {
      const tripData = {
        pickupLocation: 'New York',
        dropoffLocation: 'Los Angeles',
        // ...
      };
      
      const trip = await createTrip(tripData);
      
      expect(trip).toBeDefined();
      expect(trip.status).toBe('PENDING');
    });
    
    it('should throw error for invalid data', async () => {
      await expect(createTrip({})).rejects.toThrow();
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 📋 Pull Request Process

### 1. Before Submitting

- [ ] Code follows project style guidelines
- [ ] Tests added/updated and passing
- [ ] Documentation updated
- [ ] No console.log statements (use proper logging)
- [ ] ESLint passes without errors
- [ ] TypeScript compiles without errors

### 2. PR Title Format

Use conventional commits format:

```
feat: Add video verification workflow
fix: Resolve trip matching algorithm bug
docs: Update API documentation
refactor: Simplify authentication middleware
test: Add tests for rating system
chore: Update dependencies
```

### 3. PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe testing performed

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Tests pass
- [ ] Code follows style guidelines
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### 4. Review Process

1. Automated checks must pass (linting, tests)
2. At least one maintainer review required
3. Address review comments
4. Squash commits if requested
5. Maintainer will merge when approved

## 🐛 Bug Reports

Use the bug report template:

```markdown
## Bug Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
If applicable

## Environment
- OS: [e.g., macOS 12.0]
- Browser: [e.g., Chrome 95]
- Node version: [e.g., 18.0.0]
```

## 💡 Feature Requests

Use the feature request template:

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Any other relevant information
```

## 🔒 Security Issues

**DO NOT** open public issues for security vulnerabilities.

Instead, email security@truckercarriage.com with:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 📚 Documentation

### Code Documentation

```typescript
/**
 * Creates a new trip request and finds matching routes
 * 
 * @param data - Trip creation data including pickup/dropoff locations
 * @returns Created trip with potential matches
 * @throws {ValidationError} If trip data is invalid
 */
async function createTrip(data: CreateTripDto): Promise<TripWithMatches> {
  // Implementation
}
```

### API Documentation

Update `docs/API_DOCUMENTATION.md` when adding/changing endpoints.

### README Updates

Keep README.md up to date with:
- New features
- Configuration changes
- Installation steps
- Usage examples

## 🎨 UI/UX Guidelines

### Accessibility

- Use semantic HTML
- Add ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers

### Responsive Design

- Mobile-first approach
- Test on various screen sizes
- Use Tailwind's responsive classes

### Component Structure

```tsx
// Good component structure
interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ 
  onClick, 
  children, 
  variant = 'primary',
  disabled = false 
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {children}
    </button>
  );
}
```

## 🔄 Git Workflow

### Commit Messages

Follow conventional commits:

```bash
# Feature
git commit -m "feat: add video upload progress indicator"

# Bug fix
git commit -m "fix: resolve race condition in trip matching"

# Documentation
git commit -m "docs: add deployment guide"

# Refactoring
git commit -m "refactor: simplify authentication logic"

# Tests
git commit -m "test: add unit tests for rating system"
```

### Branch Naming

```bash
feature/video-verification
fix/trip-matching-bug
docs/api-documentation
refactor/auth-middleware
```

### Keeping Your Fork Updated

```bash
# Add upstream remote
git remote add upstream https://github.com/ORIGINAL/trucker-carriage-platform.git

# Fetch upstream changes
git fetch upstream

# Merge upstream changes
git checkout main
git merge upstream/main
```

## 📦 Dependencies

### Adding Dependencies

```bash
# For backend
cd apps/backend
npm install package-name

# For frontend
cd apps/customer-web
npm install package-name
```

### Dependency Guidelines

- Prefer well-maintained packages
- Check bundle size impact
- Review security advisories
- Update package.json description

## 🚫 What Not to Do

- Don't commit `.env` files
- Don't commit `node_modules/`
- Don't commit large binary files
- Don't force push to main
- Don't merge your own PRs
- Don't ignore ESLint/TypeScript errors
- Don't skip tests

## 🏆 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Eligible for contributor badges

## 📞 Getting Help

- **Questions**: Open a GitHub Discussion
- **Chat**: Join our Slack channel
- **Email**: dev@truckercarriage.com

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Trucker Carriage Platform! 🚚✨
