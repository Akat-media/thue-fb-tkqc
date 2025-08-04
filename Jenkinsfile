pipeline {
    agent any

    tools {
        nodejs 'Node20'
    }

    environment {
        DEPLOY_DIR = '/var/www/thue-fb-tkqc'
        SSH_CREDENTIALS_ID = 'vps-ssh-key'
        VPS_USER = "${env.VPS_USER}"
        VPS_IP = "${env.VPS_IP}"
    }

    stages {
        stage('Deploy') {
            steps {
                sshagent (credentials: ["${SSH_CREDENTIALS_ID}"]) {
                    script {
                        sh """
ssh -o StrictHostKeyChecking=no -p 24700 ${VPS_USER}@${VPS_IP} 'bash -lc "
echo PATH=\\\$PATH;
which nvm;
nvm use 20.16.0;
which node;
which npm;
cd ${DEPLOY_DIR};
git pull origin main;
npm run prod;
docker image prune -af
"'
                        """
                    }
                }
            }
        }
    }
}
