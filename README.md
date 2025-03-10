# Omniflex: Enterprise Patterns, Startup Speed

## Usage Notice
This project is built using the Omniflex Mono-Repo. For more information, visit [omniflex.io](https://omniflex.io).

The omniflex mono-repo is available at [here](https://github.com/Zay-Dev/omniflex).

Omniflex is a TypeScript-based monorepo designed to accelerate Node.js backend development. 

It aims to prevent the vendor lock-in, and improve the development experience.


## Key Thoughts from the Team

1. **Readability**
   - comes first
   - is more important than cleverness
   - yes, I can't read file longer than 250 lines
2. **TypeScript**
   - is not a silver bullet, it's a tool
   - should be more like helping me to tell my IDE what to suggest
   - is eventually compiled to JavaScript, typesafety is for the compiler, not the runtime
3. **The Repository Interface**
   - I guarantee you that 99% of our users will not use our IRepository interface
   - you could use the `DbEntries` validator if you use the interface though
4. **/apps**
   - that's pretty cool though
   - the auto-generated swagger is also pretty cool
   - less learning curve for the new joiners, yay!
5. **Design Patterns**
   - Practical, practical, practical
6. **Flexible infra layer, strong foundation, modular architecture, enterprise ready, QA ready**
   - Building enterprise-grade applications
   - Supporting multiple teams with different technical requirements
   - Maintaining high code quality and consistency
   - Rapid development with reusable components
   - Scalable and maintainable architecture
   - *this point is entirely from the AI, it keeps saying that*

## Getting Started

### Quick Start

*This project is still in the alpha version*

```bash
# Create new project
npx github:Zay-Dev/omniflex-npx --express --alpha my-project

# OR Using the https://www.omniflex.io/get-started/express document
npx github:Zay-Dev/omniflex-npx --alpha my-project

# OR clone manually
git clone --recurse-submodules git@github.com:Zay-Dev/Omniflex.git my-project
cd my-project

## Update .env file, install dependencies and start the server
yarn && yarn dev:server
```

### Project Structure

```
/
├── core/                    # Core utilities and types
├── infra/                   # Infrastructure packages
│   ├── infra-express/       # Express.js integration
│   ├── infra-mongoose/      # Mongoose adapter
│   ├── infra-postgres/      # Postgres adapter
│   ├── infra-sequelize-v6/  # Sequelize V6 adapter
│   └── ...                  # Other infrastructure
├── modules/                 # Feature modules
│   ├── module-identity/     # Identity management
│   └── ...                  # Other modules
└── apps/                    # Your applications
    └── server/              # Example Express server
```

### Package Configuration

Configure your application's `package.json` to work with Yarn workspaces. 
This enables you to manage dependencies and run commands from the root directory.

```json
/* apps/server/package.json */
{
  "name": "apps-server",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "nodemon",
    "start": "node dist/index.js",
    "build": "tsc && tsc-alias"
  },
  "nodemonConfig": {
    "delay": 100,
    "watch": [
      "../../",
      ".env"
    ],
    "ext": "js,ts,ts,json",
    "exec": "tsc --noEmit && tsx -C development index.ts",
    "ignore": [
      "**/dist/**",
      "**/docs/**"
    ]
  }
}

/* apps/server/tsconfig.json */
{
  "extends": "../../tsconfig.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./",
    "baseUrl": "./",
    "paths": {
      "@/*": [
        "./*"
      ]
    }
  },
  "tsc-alias": {
    "resolveFullPaths": true
  },
  "include": [
    "./**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "dist"
  ]
}
```

With Yarn workspaces, you can run commands for specific packages from the root directory:

```bash
# Add dependencies
yarn ws-run apps-server add @omniflex/core@^0.1.0
yarn -W add typescript   # -- add a sharing dependency to the root

# Run scripts
yarn ws-run apps-server dev
yarn ws-run apps-server start  # after 'yarn build'

yarn test
yarn build
yarn dev:server     # predefined yarn workspace apps-server dev
yarn start:server   # predefined yarn workspace apps-server start
```

For more information about Yarn workspaces, visit the [official documentation](https://classic.yarnpkg.com/lang/en/docs/workspaces/).

### Express Server Example

For a complete working example, please refer to our reference implementation at 
[omniflex-express-apps-server](https://github.com/Zay-Dev/omniflex-express-apps-server).

Or our [get-started document](https://www.omniflex.io/get-started/express).


### Features

#### `core/`

- **Error Handling**
  - Generic and standardized error types and handling mechanisms
  - Although the usage looks like built for HTTP, it is not limited to HTTP
- **Dependency Injection**
  - Uses [awilix](https://github.com/jeffijoe/awilix) to manage dependencies and promote loose coupling between components

The core package serves as the foundation for all other packages in the Omniflex ecosystem, providing essential utilities and standardized patterns that ensure consistency across your application.

### Usage Example

```typescript
import { logger, errors, Containers } from '@omniflex/core';

// Logging
logger.info('Simple message');
logger.info('Operation successful', { tags: ['user-service'] }); // -- when you want to print [user-service] as a prefix
logger.error('Operation failed', { error, tags: ['auth'] });

// Error handling
throw errors.notFound('User not found');
throw errors.forbidden('Invalid permissions');

// Container usage
const container = Containers.create('myApp');
container.register('userService', () => new UserService());
```

#### `infra/infra-express/`

- **Error Handling**
  - Standardized error responses with configurable detail exposure
  - Capture unhandled async errors and prevent the app from dying
- **Logging**
  - Comprehensive request/response logging with [morgan](https://github.com/expressjs/morgan) integration
  - Detailed request/response logging with request ID tracking
  - Automatic sanitization and masking of sensitive data
- **Security**
  - [cors](https://github.com/expressjs/cors)
  - [helmet](https://github.com/helmetjs/helmet)
- **Utility Middleware**
  - [express-fileupload](https://github.com/richardgirges/express-fileupload) for file upload handling
  - [express-useragent](https://github.com/biggora/express-useragent) for user agent parsing
  - [response-time](https://github.com/expressjs/response-time) for tracking response time
- compatible with the customized [swagger-autogen](https://github.com/swagger-autogen/swagger-autogen)
- Uses [joi](https://github.com/hapijs/joi) for request body validation
- Uses [joi-to-swagger](https://github.com/Twipped/joi-to-swagger) for automatic generation of swagger documentation, eliminating the need for manual maintenance of request body schema
- **Base Controller Classes**: each controller instance serves one and only one request, eliminating the messy `(req: Request, res: Response)` passing around but just `this.req` and `this.res`
  - BaseExpressController:
    - provides `tryAction` and `tryActionWithBody` methods out of the box that make it easier to wrap logic in a try/catch block and standardized the error handling
    - provides `throwNotFound` and `throwForbidden` methods out of the box that make it easier to throw standardized errors
    - provides `respondOne` and `respondMany` methods out of the box that make it easier to respond with standardized data structure
    - `this.pathId`, `this.pageSize` and `this.page` are automatically populated for convenience
  - BaseEntitiesController:
    - everything from `BaseExpressController`, and
    - `tryListAll`, `tryGetOne`, `tryListPaginated`, `tryCreate`, `tryUpdate`, `tryDelete` and `trySoftDelete` methods out of the box that make it easier to perform CRUD operations

Usage example:

```typescript
// -- controller.ts

class Controller extends UsersController<TUser & {
  appTypes: string[];
}> {
  tryRegisterWithEmail(appType: string) {
    type TBody = Schemas.TBodyRegisterWithEmail;

    this.tryActionWithBody<TBody>(async ({ password, ...body }) => {
      const { id } = await this.register(appType, password, {
        ...body,
        username: body.email,
      });

      const user = await this.repository.update(id, {
        appTypes: [appType],
      });

      return this.respondOne(user);
    });
  }

  tryLoginWithEmail(appType: string) {
    type TBody = Schemas.TBodyLoginWithEmail;

    this.tryActionWithBody<TBody>(async (body) => {
      const user = await this.login(appType, {
        ...body,
        username: body.email,
      });
      const userAppTypes = user.appTypes || [];

      if (!userAppTypes.includes(appType)) {
        throw errors.unauthorized();
      }

      const {
        accessToken,
        refreshToken,
      } = await AuthService.getTokens(user, this.res);

      return this.respondOne({
        refreshToken,
        token: accessToken,
      });
    });
  }

  tryRefreshToken() {
    type TBody = UserSessionSchemas.TBodyRefreshToken;

    this.tryActionWithBody<TBody>(async ({ refreshToken }) => {
      const user = this.res.locals.required.user;
      const tokens = await AuthService
        .refreshTokens(refreshToken, user, this.res);

      return this.respondOne({
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    });
  }

  tryLogout() {
    this.tryAction(async () => {
      await AuthService.logout(this.res);

      return this.res.status(204).send();
    });
  }

  tryGetMyProfile() {
    this.tryAction(async () => {
      const profile = this.res.locals.required.profile;

      return this.respondOne({
        profileId: profile.id,
        ...profile,
      });
    });
  }
}

// -- exposed.ts
// #swagger.file.tags = ['Users']
// #swagger.file.basePath = '/v1/users'

import ...;

const router = Servers.exposedRoute('/v1/users');

const appType = Servers.servers.exposed.type;

router
  .get('/my/profile',
    // #swagger.security = [{"bearerAuth": []}]
    auth.requireExposed,    // -- valid JWT with `exposed` appType

    DbEntries.requiredById(
      repositories.users,
      (_, res) => res.locals.user.id,       // -- retrieved from JWT
      true,
    ),
    DbEntries.requiredFirstMatch(
      repositories.profiles,
      (_, res) => ({ userId: res.locals.user.id }),
      'profile'
    ),

    create(controller => controller.tryGetMyProfile()),
  )

  .post('/',
    // #swagger.jsonBody = required|components/schemas/moduleIdentity/registerWithEmail
    // -- schema is auto generated by joi-to-swagger
    IdentityValidators.validateRegisterWithEmail,
    create(controller => controller.tryRegisterWithEmail(appType)),
  )

  .post('/access-tokens',
    // #swagger.jsonBody = required|components/schemas/moduleIdentity/loginWithEmail
    IdentityValidators.validateLoginWithEmail,
    create(controller => controller.tryLoginWithEmail(appType)),
  )

  .put('/access-tokens',
    // #swagger.jsonBody = required|components/schemas/moduleUserSession/refreshToken
    UserSessionValidators.validateRefreshToken,
    validateRefreshToken,
    create(controller => controller.tryRefreshToken()),
  )

  .delete('/access-tokens',
    // #swagger.security = [{"bearerAuth": []}]
    auth.requireExposed,
    create(controller => controller.tryLogout()),
  );
```

#### `infra/infra-{db}/`

##### `infra-mongoose/`
- **Type System**
  - Predefined schema types with common configurations:
    - Easier to read and understand
    - Required/Optional variants for all basic types
    - Integer handling with automatic rounding
    - String enums with type safety
    - Boolean fields with default values
    - Still compatible with the native definitions

Usage example:

```typescript
import { getConnection } from '@omniflex/infra-mongoose';
import * as Types from '@omniflex/infra-mongoose/types';

// Connection setup
const connection = await getConnection({
  mongoose: {
    uri: 'mongodb://localhost:27017',
    dbName: 'myapp'
  }
});

// Schema definition using provided types
const userSchema = {
  name: Types.requiredString,
  bio: Types.optionalString,
  joinedAt: Types.requiredDate,
  isActive: Types.defaultFalse
};
```

##### `infra-postgres/`
- **Connection Management**
  - Uses [sequelize](https://sequelize.org/) ORM
  - Built-in logging integration with `core/` logger
  - Predefined schema types with common configurations:
    - Easier to read and understand
    - Required/Optional variants for all basic types
    - Consistent type definitions across the application
  - Still compatible with the native definitions

Usage example:
```typescript
import { getConnection } from '@omniflex/infra-postgres';
import * as Types from '@omniflex/infra-postgres/types';

// Connection setup with automatic logging
const connection = await getConnection({
  postgres: {
    uri: 'postgresql://user:pass@localhost:5432/myapp'
  }
});

// Schema definition using provided types
const userSchema = {
  name: Types.requiredString(),
  bio: Types.optionalString(),
  joinedAt: Types.requiredDate(),
  isActive: Types.defaultFalse()
};
```

The database infrastructure packages are designed to provide consistent patterns and interfaces while abstracting away the complexity of database operations.

#### Git Submodules

This project uses a forked version of [swagger-autogen](https://github.com/swagger-autogen/swagger-autogen) as a git submodule. After cloning the repository, you'll need to initialize and update the submodule:

```bash
git submodule init
git submodule update
```

Or you can clone the repository with submodules in one command:

```bash
git clone --recurse-submodules git@github.com:Zay-Dev/Omniflex.git
```

The forked swagger-autogen includes custom enhancements specific to our needs while maintaining compatibility with the original project.

## Contributing

While we are not currently accepting code contributions, we welcome:
- Bug reports
- Feature suggestions
- General feedback and recommendations

Please feel free to open issues to share your ideas or report problems.

## License

See the [LICENSE](LICENSE) file for complete terms
