/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */

const { PgLiteral } = require('node-pg-migrate/dist/index');

exports.up = (pgm) => {
  pgm.createTable('likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    owner: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'users(id)',
      onDelete: 'CASCADE',
    },
    thread_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'threads(id)',
      onDelete: 'CASCADE',
    },
    comment_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      references: 'comments(id)',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: 'TIMESTAMP',
      default: new PgLiteral('CURRENT_TIMESTAMP'),
    },
  });

  pgm.addConstraint('likes', 'likes_owner_thread_id_comment_id_unique', {
    unique: ['owner', 'thread_id', 'comment_id'],
  });
};

exports.down = (pgm) => {
  pgm.dropTable('likes');
};
