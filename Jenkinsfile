pipeline {
    agent any
    options {
        disableConcurrentBuilds()
    }
    tools {
        nodejs "NodeJS_20"
    }
    environment {
        AWS_REGION = "ap-south-1"
        S3_BUCKET  = "publications.snsihub.ai"
        CLOUDFRONT_DISTRIBUTION_ID = "E17RWJDWEYRP48"
        VITE_ENABLE_MOCK = false
        VITE_RAZORPAY_KEY_ID = "rzp_test_T8UWvt2fHT2O7a"
    }
    stages {
        stage('Check Node & npm') {
            steps {
                sh 'node -v'
                sh 'npm -v'
            }
        }
        stage('Install Frontend Dependencies') {
            steps {
                dir('frontend') {
                    sh '''
                    rm -rf node_modules
                    npm ci || npm install
                    '''
                }
            }
        }
        stage('Build Frontend') {
            steps {
                dir('frontend') {
                    sh '''
                    set -x
                    CI=false npm run build
                    echo "BUILD EXIT CODE: $?"
                    stat dist 2>&1 || echo "dist missing right after stat"
                    ls -la
                    pwd
                    '''
                }
            }
        }
        stage('Upload to S3') {
            steps {
                dir('frontend') {
                    sh '''
                    aws s3 sync dist s3://$S3_BUCKET/ \
                    --region $AWS_REGION \
                    --delete
                    '''
                }
            }
        }
        stage('Invalidate CloudFront') {
            steps {
                sh '''
                aws cloudfront create-invalidation \
                --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
                --paths "/*"
                '''
            }
        }
    }
    post {
        success {
            echo '✅ Frontend Deployment Successful!'
        }
        failure {
            echo '❌ Frontend Deployment Failed!'
        }
    }
}
