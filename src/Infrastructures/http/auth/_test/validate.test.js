const authValidate = require('../validate');

describe('JWT auth validate function', () => {
  it('should return isValid true and extract user ID', () => {
    const artifacts = {
      decoded: {
        payload: {
          id: 'user-123',
        },
      },
    };

    const result = authValidate(artifacts);

    expect(result).toEqual({
      isValid: true,
      credentials: {
        id: 'user-123',
      },
    });
  });
});
