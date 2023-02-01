class User < ApplicationRecord
  has_secure_password

  validates :username, 
    uniqueness: true, 
    length: { in: 3..30 }, 
    format: { without: URI::MailTo::EMAIL_REGEXP, message:  "can't be an email" }
  validates :email, 
    uniqueness: true, 
    length: { in: 3..255 }, 
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :session_token, presence: true, uniqueness: true
  validates :password, length: { in: 6..255 }, allow_nil: true

  before_validation :ensure_session_token

  def self.find_by_credentials(username, password)
    user = User.find_by(username: username)

    if user&.authenticate(password)
      return user
    else
      nil
    end
  end

  def generate_unique_session_token

    while true
      token = SecureRandom::urlsafe_base64
      return token unless (User.exists?(session_token: token)) 
    end
    # in a loop:
      # use SecureRandom.base64 to generate a random token
      # use `User.exists?` to check if this `session_token` is already in use
      # if already in use, continue the loop, generating a new token
      # if not in use, return the token
  end

  def ensure_session_token
    self.session_token ||= generate_unique_session_token
    # if `self.session_token` is already present, leave it be
    # if `self.session_token` is nil, set it to `generate_unique_session_token`
  end

  def reset_session_token!
    # self.session_token = generate_unique_session_token
    # self.save!
    self.update!(session_token: generate_unique_session_token)
    self.session_token
  end

end
